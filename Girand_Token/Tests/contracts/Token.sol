// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Token is ERC20, Ownable {
    uint public maxSupply = 10000 * 10**18;
    uint public totalTokens;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable(msg.sender) {

    }

    function mint(uint256 amount) public onlyOwner {
        require(amount + totalTokens < maxSupply, "Exceeded max token amount");
        _mint(msg.sender, amount);
        totalTokens += amount;
    }

    function Airdrop(uint256 amount, address to) public onlyOwner {
        require(amount + totalTokens < maxSupply, "Exceeded max token amount");
        _mint(to, amount);
        totalTokens += amount;
    }

    function burn(address account, uint256 amount) public onlyOwner {
        require(amount + totalTokens < maxSupply, "Exceeded max token amount");
        _burn(account, amount);
        totalTokens -= amount;
    }

}

