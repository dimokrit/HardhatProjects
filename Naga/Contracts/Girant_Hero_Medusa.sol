// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "https://github.com/chiru-labs/ERC721A/blob/main/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/// @author Girant Team
/// @title Girand Hero “Medusa”
contract Girand_Hero_Medusa is Ownable, ReentrancyGuard, ERC2981, ERC721A {

    struct Drop {
        uint256 id;
        uint256 totalSupply;
        uint256 preMintMaxSupply;
        uint256 maxDropSupply;
        uint256 timePreMintStart;
        uint256 timeMintAfterPreMint;
        bool preMintStarted;
        bool whiteList;
        bytes32 merkleRoot;
        mapping(address => bool) NFTtracker;
    }
    
    mapping(uint256 => Drop) drops;
    uint public maxSupply;
    uint256 public activeDrop;
    string private baseTokenURI;

    event BaseURIChanged(string baseURI);
    event FreeMint(address mintTo, uint256 tokensCount);

    constructor(string memory baseURI, string memory name, string memory symbol, uint96 royalty, bytes32 _merkleRoot) ERC721A(name, symbol) Ownable(msg.sender) {
        baseTokenURI = baseURI;
        activeDrop = 1;
        drops[activeDrop].preMintMaxSupply = 300;
        drops[activeDrop].maxDropSupply = 500;
        drops[activeDrop].timeMintAfterPreMint = 3600;
        drops[activeDrop].whiteList = true;
        drops[activeDrop].merkleRoot = _merkleRoot;
        maxSupply = drops[activeDrop].maxDropSupply;
        super._setDefaultRoyalty(msg.sender, royalty);
    }

    /// @notice Modifiers

    /// @notice Check minting event has been started
    modifier whenPreMintStarted() {
        require(drops[activeDrop].preMintStarted, "Minting event has not started yet");
        _;
    }

    /// @notice Mint

    /// @notice Mint one free NFT to connected wallet
    /// @param proof is Merkle proof of leaf from address
    function freeMint(bytes32[] calldata proof) external whenPreMintStarted nonReentrant {
        if (drops[activeDrop].whiteList)
            require(checkInWhitelist(proof), "Your address is not in the whitelist");
        if (drops[activeDrop].timePreMintStart + drops[activeDrop].timeMintAfterPreMint > block.timestamp)
            require(drops[activeDrop].totalSupply <= drops[activeDrop].preMintMaxSupply, "Exceeded max premint NFTs amount");
        require(drops[activeDrop].totalSupply <= drops[activeDrop].maxDropSupply, "Exceeded max NFTs amount");
        require(!drops[activeDrop].NFTtracker[msg.sender], "Minting would exceed wallet limit");
        drops[activeDrop].NFTtracker[msg.sender] = true;
        drops[activeDrop].totalSupply++;
        _safeMint(msg.sender, 1);
        emit FreeMint(msg.sender, 1);
    }

    /// @notice Settings

    /// @notice Switch collection status
    function startPreMint() external onlyOwner {
        drops[activeDrop].timePreMintStart = block.timestamp;
        drops[activeDrop].preMintStarted = true;
    }

    /// @notice Stop minting event
    function stopMint() external onlyOwner {
        drops[activeDrop].preMintStarted = false;
    }

    /** @notice Set new drop for collection
        @param _preMintMaxSupply is new preMint max supply value
        @param _maxSupply is new max supply value
        @param _timeMintAfterPreMint is time between starting preMint and starting Mint in unix
        @param _merkleRoot is merkle root generated from whitelist addresses
    */
    function setNewDrop(uint256 _preMintMaxSupply, uint256 _maxSupply, uint256 _timeMintAfterPreMint, bool _whiteList, bytes32 _merkleRoot) public onlyOwner {
        activeDrop++;
        drops[activeDrop].id = activeDrop;
        drops[activeDrop].preMintMaxSupply = _preMintMaxSupply;
        drops[activeDrop].maxDropSupply = _maxSupply;
        drops[activeDrop].timeMintAfterPreMint = _timeMintAfterPreMint;
        drops[activeDrop].whiteList = _whiteList;
        drops[activeDrop].merkleRoot = _merkleRoot;
        maxSupply += _maxSupply;
    }

    ///@notice Set new PreMint MaxSupply
    ///@param _preMintMaxSupply is new preMint max supply value
    function setNewPreMintMaxSupply(uint256 _preMintMaxSupply) public onlyOwner {
        drops[activeDrop].preMintMaxSupply = _preMintMaxSupply;
    }

    ///@notice Set new MaxSupply
    ///@param _maxSupply is new max supply value
    function setNewMaxSupply(uint256 _maxSupply) public onlyOwner {
        drops[activeDrop].maxDropSupply = _maxSupply;
    }

    ///@notice Set new time Mint After PreMint
    ///@param _timeMintAfterPreMint is time between starting preMint and starting Mint in unix
    function setNewTimeMintAfterPreMint(uint256 _timeMintAfterPreMint) public onlyOwner {
        drops[activeDrop].timeMintAfterPreMint = _timeMintAfterPreMint;
    }

    ///@notice Set WhiteList state
    ///@param _whiteList is state which set use WhiteList or not
    function setWhiteListState(bool _whiteList) public onlyOwner {
        drops[activeDrop].whiteList = _whiteList;
    }

    ///@notice Set new merkleRoot
    ///@param _merkleRoot is merkle root generated from whitelist addresses
    function setNewMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
        drops[activeDrop].merkleRoot = _merkleRoot;
    }

    /// @notice Metadata functions
 
    /// @return baseTokenURI The NFT metedata folder uri
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    /** @param tokenId is the ID of the NFT whose uri was requested
        @return uri The metedata uri of NFT
    */
    function tokenURI(uint256 tokenId) public view override(ERC721A) returns (string memory) {
        string memory _tokenURI = super.tokenURI(tokenId);
        return string(abi.encodePacked(_tokenURI, ".json"));
    }

    /** @notice Set new uri of metadata folder
        @param baseURI is the new uri
    */
    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
        emit BaseURIChanged(baseURI);
    }

    /// @notice Royalties

    /** @notice Change default royalties percentage value
        @param receiver is receiver of royalties
        @param feeNumerator is amount of royalties (value 500 equal 5% royalties from price)
    */
    function changeDefaultRoyalties(address receiver, uint96 feeNumerator) external onlyOwner {
        super._deleteDefaultRoyalty();
        super._setDefaultRoyalty(receiver, feeNumerator);
    }

    ///@dev ovveride interface
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721A, ERC2981) returns (bool) {
    return  ERC721A.supportsInterface(interfaceId) || 
            ERC2981.supportsInterface(interfaceId);
    }

    function checkInWhitelist (bytes32[] calldata proof) internal view returns (bool) {
        bytes32 leaf = keccak256(abi.encode(msg.sender));
        bool verified = MerkleProof.verify(proof, drops[activeDrop].merkleRoot, leaf);
        return verified;
    }
}
