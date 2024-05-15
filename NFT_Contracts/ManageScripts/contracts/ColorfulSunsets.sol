// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./imports/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/// @author dimokrit
/// @title Colorful Sunsets
contract ColorfulSunsets is Ownable, ReentrancyGuard, ERC2981, ERC721A {
    bool mintStarted;
    mapping(address => bool) NFTtracker;

    uint public maxSupply;
    string private baseTokenURI;

    event BaseURIChanged(string baseURI);
    event FreeMint(address mintTo, uint256 tokensCount);

    constructor(
        string memory baseURI,
        string memory name,
        string memory symbol,
        uint96 royalty,
        address royaltyAddress
    ) ERC721A(name, symbol) Ownable(msg.sender) {
        baseTokenURI = baseURI;
        maxSupply = 10;
        super._setDefaultRoyalty(royaltyAddress, royalty);
    }

    /// @notice Modifiers

    /// @notice Check minting event has been started
    modifier whenPreMintStarted() {
        require(mintStarted, "Minting event has not started yet");
        _;
    }

    /// @notice Mint

    /// @notice Mint one free NFT to connected wallet
    function freeMint() external whenPreMintStarted nonReentrant {
        require(totalSupply() < maxSupply, "Exceeded max NFTs amount");
        require(!NFTtracker[msg.sender], "Minting would exceed wallet limit");
        NFTtracker[msg.sender] = true;
        _safeMint(msg.sender, 1);
        emit FreeMint(msg.sender, 1);
    }

    /// @notice Settings

    /// @notice Switch collection status
    function startPreMint() external onlyOwner {
        mintStarted = true;
    }

    /// @notice Stop minting event
    function stopMint() external onlyOwner {
        mintStarted = false;
    }

    /** @notice Set new drop for collection
        @param _preMintMaxSupply is new preMint max supply value
        @param _maxSupply is new max supply value
        @param _timeMintAfterPreMint is time between starting preMint and starting Mint in unix
        @param _merkleRoot is merkle root generated from whitelist addresses
    */

    ///@notice Set new MaxSupply
    ///@param _maxSupply is new max supply value
    function setNewMaxSupply(uint256 _maxSupply) public onlyOwner {
        maxSupply = _maxSupply;
    }

    /// @notice Metadata functions

    /// @return baseTokenURI The NFT metedata folder uri
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    /** @param tokenId is the ID of the NFT whose uri was requested
        @return uri The metedata uri of NFT
    */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721A) returns (string memory) {
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
    function changeDefaultRoyalties(
        address receiver,
        uint96 feeNumerator
    ) external onlyOwner {
        super._deleteDefaultRoyalty();
        super._setDefaultRoyalty(receiver, feeNumerator);
    }

    ///@dev ovveride interface
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721A, ERC2981) returns (bool) {
        return
            ERC721A.supportsInterface(interfaceId) ||
            ERC2981.supportsInterface(interfaceId);
    }
}
