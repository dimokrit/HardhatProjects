// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @author Girant Team
/// @title Girand Token
contract Launchpad is Ownable, ReentrancyGuard {

    /// @notice Struct Stage is struct of vesting stages
    /// @notice Stage can be configured for different conditions, according to tokenomics
    struct Stage {
        uint index;
        bool registrationStarted;
        bool stageStarted;
        bool whitelist;
        uint totalUsers;
        uint maxUsers;
        uint totalTokenAmount;
        uint userTokenAmount;
        uint percentTGE;
        uint percentLinear;
        uint firstClaimAmount;
        uint onePaymentAmount;
        uint startTime;
        uint paymentPeriod;
        uint lockUpPeriod;
        bytes32 merkleRoot;
        mapping (address => bool) addressRegistered;
        mapping (address => uint) amountReceived;
    }

    mapping(uint => Stage) stages;
    mapping(address => bool) public blacklisted;

    uint lastStageIndex;

    IERC20 Gi_Token;

    event Claim(uint index, address receiver, uint amount);
    event Registration(uint index, address user, bool whitelist);

    constructor(address tokenAddress) Ownable(msg.sender) {
        Gi_Token = IERC20(tokenAddress);
    }

    /// @notice Modifiers

    /// @notice whenStageStarted checks stage has been started
    /// @param index is index of current stage
    modifier whenStageStarted(uint index) {
        require(stages[index].stageStarted, "Stage is not started yet");
        _;
    }

    /// @notice whenRegistrationStarted checks stage registration has been started
    /// @param index is index of current stage
    modifier whenRegistrationStarted(uint index) {
        require(stages[index].registrationStarted, "Stage is not started yet");
        _;
    }

    /// @notice indexIsCorrect checks index is correct
    /// @param index is index of current stage
    modifier indexIsCorrect(uint index) {
        require(index <= lastStageIndex, "Stage does not exist");
        _;
    }

    /// @notice userIsNotBlocked checks user is not in blacklist
    /// @param user is user address
    modifier userIsNotBlocked(address user) {
        require(!blacklisted[user], "Your address in blacklist");
        _;
    }

    /// @notice User functions

    /// @notice stageRegistration allows users to register on stage whithout whitelist
    /// @param index is index of current stage
    function stageRegistration(uint index) external indexIsCorrect(index) whenRegistrationStarted(index) userIsNotBlocked(msg.sender) {
        require(!stages[index].whitelist, "The stage is available only by whitelist");
        require(stages[index].totalUsers < stages[index].maxUsers);
        stages[index].totalUsers++;
        stages[index].addressRegistered[msg.sender] = true;

        emit Registration(index, msg.sender, false);
    }

    /// @notice stageRegistrationWL allows users to register on stage whith whitelist
    /// @param index is index of current stage
    /// @param proof is proof the user is on the whitelist generated by MerkleTree library
    function stageRegistrationWL(uint index, bytes32[] calldata proof) external indexIsCorrect(index) whenRegistrationStarted(index) userIsNotBlocked(msg.sender) {
        require(checkInWhitelist(proof, index), "Your address is not in the whitelist");
        require(stages[index].totalUsers < stages[index].maxUsers);
        stages[index].totalUsers++;
        stages[index].addressRegistered[msg.sender] = true;

        emit Registration(index, msg.sender, true);
    }

    /** 
     * @notice claim allows users to get his tokens (according to stage conditional)
     * 
     * The function takes into account all stages conditions of tokenomics
     * TGE, Lock Up, Linear
     * It  is designed in such a way that it checks all the necessary conditions to receive tokens
     * All data is specified in the Stage structure under the index [index], and must be correct
     *
     * @param index is index of current stage
     */
    function claim(uint index) external indexIsCorrect(index) whenStageStarted(index) nonReentrant userIsNotBlocked(msg.sender) {
        Stage storage _stage = stages[index];
        address payable receiver = payable (msg.sender);
        require(_stage.addressRegistered[receiver], "Your address is not registered");
        require(_stage.amountReceived[receiver] < _stage.userTokenAmount, "You claimed all your tokens");
        require(checkLockUpPeriod(index), "Lock up period is active");
        uint claimsPassed = checkClaimsPassed(index);
        uint availableAmount = (_stage.onePaymentAmount * claimsPassed) + _stage.firstClaimAmount - _stage.amountReceived[receiver];
        require(availableAmount > 0, "Your address do not have claimable tokens");
        
        _stage.amountReceived[receiver] += availableAmount;
        Gi_Token.transfer(receiver, availableAmount);
        emit Claim(index, receiver, availableAmount);
    }

    /// @notice Admin functions

    /**
     * @notice adminRegistration allows the owner to register an indefinite number of addresses per stage
     * !Carefully, a large fee is possible
     *
     * @param index is index of current stage
     * @param userAddress is array of addresses
     */ 
    function adminRegistration(uint index, address[] calldata userAddress) external indexIsCorrect(index) whenRegistrationStarted(index) onlyOwner {
        require(stages[index].totalUsers + userAddress.length <= stages[index].maxUsers);
        for (uint i = 0; i < userAddress.length; i++) {
            stages[index].totalUsers++;
            stages[index].addressRegistered[userAddress[i]] = true;
        }
    }

    /**
     * @notice newStage allows the owner to add new stage with any conditionals
     *
     * @param whitelist is the state checks using of whitelist. Set true if you are
     * @param maxUsers is the maximum number of users that can be registered at the stage
     * @param totalTokenAmount is the amount of tokens intended for this stage
     * @param percentTGE is the percent of tokens (of totalTokenAmount), wich will be available to get, immediately after the start of the stage (set to 0 if not needed)
     * @param percentLinear is the percent of (of totalTokenAmount), wich will be paid out in linear, each paymentPeriod
     * @param startTime is the time, when stage will be started and claimable (set in UNIX time)
     * @param paymentPeriod is the time period (month, some days, etc.) after which a new portion of tokens will be unlocked in linear vesting (set in UNIX time)
     * @param lockUpPeriod is the time period (month, some days, etc.) during which the tokens will be frozen on the contract (set in UNIX time) (set to 0 if not needed)
     * @param merkleRoot is the merkle root hash of whitelist, generated vy MerkleTree library (set 0x0000000000000000000000000000000000000000000000000000000000000000 if not needed)
     */ 
    function newStage(
        bool whitelist,
        uint maxUsers,
        uint totalTokenAmount,
        uint percentTGE,
        uint percentLinear,
        uint startTime,
        uint paymentPeriod,
        uint lockUpPeriod,
        bytes32 merkleRoot)
        external onlyOwner {
        lastStageIndex++;
        stages[lastStageIndex].index = lastStageIndex;
        stages[lastStageIndex].whitelist = whitelist;
        stages[lastStageIndex].maxUsers = maxUsers;
        stages[lastStageIndex].totalTokenAmount = totalTokenAmount;
        stages[lastStageIndex].percentTGE = percentTGE;
        stages[lastStageIndex].percentLinear = percentLinear;
        stages[lastStageIndex].startTime = startTime;
        stages[lastStageIndex].paymentPeriod = paymentPeriod;
        stages[lastStageIndex].lockUpPeriod = lockUpPeriod;
        stages[lastStageIndex].merkleRoot = merkleRoot;
    }

    /// @notice changeWhitelistState allows to change whitelist in current stage
    /// @param index is index of current stage
    /// @param whitelist is the state checks using of whitelist. Set true if you are
    function changeWhitelistState(uint index, bool whitelist) external onlyOwner indexIsCorrect(index) {
        stages[index].whitelist = whitelist;
    }

    /// @notice changeMaxUsers allows to change maxUsers in current stage
    /// @param index is index of current stage
    /// @param maxUsers is the maximum number of users that can be registered at the stage
    function changeMaxUsers(uint index, uint maxUsers) external onlyOwner indexIsCorrect(index) {
        stages[index].maxUsers = maxUsers;
    }

    /// @notice changeTotalTokenAmount allows to change whitelist in current stage
    /// @param index is index of current stage
    /// @param totalTokenAmount is the amount of tokens intended for this stage
    function changeTotalTokenAmount(uint index, uint totalTokenAmount) external onlyOwner indexIsCorrect(index) {
        stages[index].totalTokenAmount = totalTokenAmount;
    }

    /// @notice changePercentTGE allows to change percentTGE in current stage
    /// @param index is index of current stage
    /// @param percentTGE is the percent of tokens (of totalTokenAmount), wich will be available to get, immediately after the start of the stage (set to 0 if not needed)
    function changePercentTGE(uint index, uint percentTGE) external onlyOwner indexIsCorrect(index) {
        stages[index].percentTGE = percentTGE;
    }

    /// @notice changePercentLinear allows to change percentLinear in current stage
    /// @param index is index of current stage
    /// @param percentLinear is the percent of (of totalTokenAmount), wich will be paid out in linear, each paymentPeriod
    function changePercentLinear(uint index, uint percentLinear) external onlyOwner indexIsCorrect(index) {
        stages[index].percentLinear = percentLinear;
    }

    /// @notice changeStartTime allows to change startTime in current stage
    /// @param index is index of current stage
    /// @param startTime is the time, when stage will be started and claimable (set in UNIX time)
    function changeStartTime(uint index, uint startTime) external onlyOwner indexIsCorrect(index) {
        stages[index].startTime = startTime;
    }

    /// @notice changePaymentPeriod allows to change paymentPeriod in current stage
    /// @param index is index of current stage
    /// @param paymentPeriod is the time period (month, some days, etc.) after which a new portion of tokens will be unlocked in linear vesting (set in UNIX time)
    function changePaymentPeriod(uint index, uint paymentPeriod) external onlyOwner indexIsCorrect(index) {
        stages[index].paymentPeriod = paymentPeriod;
    }

    /// @notice changeLockUpPeriod allows to change lockUpPeriod in current stage
    /// @param index is index of current stage
    /// @param lockUpPeriod is the time period (month, some days, etc.) during which the tokens will be frozen on the contract (set in UNIX time) (set to 0 if not needed)
    function changeLockUpPeriod(uint index, uint lockUpPeriod) external onlyOwner indexIsCorrect(index) {
        stages[index].lockUpPeriod = lockUpPeriod;
    }

    /// @notice changeMerkleRoot allows to change merkleRoot in current stage
    /// @param index is index of current stage
    /// @param merkleRoot is the merkle root hash of whitelist, generated vy MerkleTree library (set 0x0000000000000000000000000000000000000000000000000000000000000000 if not needed)
    function changeMerkleRoot(uint index, bytes32 merkleRoot) external onlyOwner indexIsCorrect(index) {
        stages[index].merkleRoot = merkleRoot;
    }

    /// @notice toggleRegistrationState allows to change registration state
    /// @param index is index of current stage
    function toggleRegistrationState(uint index) external onlyOwner indexIsCorrect(index) {
        stages[index].registrationStarted = !stages[index].registrationStarted;
    }

    /** 
     * @notice toggleStageState allows to change stage state
     * The function count and set userTokenAmount, onePaymentAmount and firstClaimAmount
     * After set stageStarted to true, start lock up and linear timers, and users can get first claim if TGE percent is not 0
     *
     * @param index is index of current stage
     */
    function toggleStageState(uint index) external onlyOwner indexIsCorrect(index) {
        if (!stages[index].stageStarted) {
            stages[index].registrationStarted = false;

            uint userTokenAmount = stages[index].totalTokenAmount/stages[index].totalUsers;
            stages[index].userTokenAmount = userTokenAmount;

            uint onePaymentAmount = userTokenAmount * stages[index].percentLinear / 100;
            stages[index].onePaymentAmount = onePaymentAmount;

            uint firstClaimAmount = userTokenAmount * stages[index].percentTGE / 100;
            if (firstClaimAmount > 0)
                stages[index].firstClaimAmount = firstClaimAmount;
        }
        stages[index].stageStarted = !stages[index].stageStarted;
    }

    ///@notice setBlackList allows admin to add and to delete address to blacklist (repeated function call to the same address to remove it from blacklist)
    ///@param user is user address
    function setBlacklist(address user) external onlyOwner {
        blacklisted[user] = !blacklisted[user];
    }

    ///@notice Read functions

    function getStage(uint index) external view returns(
        bool whitelist,
        uint maxUsers,
        uint totalTokenAmount,
        uint percentTGE,
        uint percentLinear,
        uint startTime,
        uint paymentPeriod,
        uint lockUpPeriod,
        bytes32 merkleRoot) {
            uint _index = index;
            return(
                stages[_index].whitelist,
                stages[_index].maxUsers,
                stages[_index].totalTokenAmount,
                stages[_index].percentTGE,
                stages[_index].percentLinear,
                stages[_index].startTime,
                stages[_index].paymentPeriod,
                stages[_index].lockUpPeriod,
                stages[_index].merkleRoot
            );    
    }

    function getUserIsRegistered(uint index, address user) external view returns(bool) {
        return(stages[index].addressRegistered[user]);    
    }

    /// @notice Internal check functions

    /// @notice checkClaimsPassed counts current the number of payments to be paid at the moment to user, excluding the first payment
    /// @param index is index of current stage
    function checkClaimsPassed(uint index) internal view returns (uint) {
        uint claimPassed = (block.timestamp - (stages[index].startTime + stages[index].lockUpPeriod))/stages[index].paymentPeriod;// Проверить инфу (дописать фёрст токен в лок ап этапы)
        return claimPassed;
    }

    /// @notice checkLockUpPeriod checks lock up period ended or not
    /// @param index is index of current stage
    function checkLockUpPeriod(uint index) internal view returns (bool) {
        bool unlocked = true;
        if (stages[index].lockUpPeriod != 0 )
            unlocked = block.timestamp > stages[index].startTime + stages[index].lockUpPeriod;
        return (unlocked);
    }

    /// @notice checkInWhitelist check address in whitelist
    /// @param proof is the user is on the whitelist generated by MerkleTree library
    /// @param index is index of current stage
    function checkInWhitelist (bytes32[] calldata proof, uint index) internal view returns (bool) {
        bytes32 leaf = keccak256(abi.encode(msg.sender));
        bool verified = MerkleProof.verify(proof, stages[index].merkleRoot, leaf);
        return verified;
    }
}