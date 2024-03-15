// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "https://github.com/chiru-labs/ERC721A/blob/main/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/// @author Girant Team
/// @title Girand  
contract Girand_Amulet is  Ownable, ReentrancyGuard, ERC2981, ERC721A {
    
    struct Drop {
        uint256 id;
        uint256 totalDropSupply;
        uint256 preMintMaxSupply;
        uint256 maxDropSupply;
        uint256 timePreMintStart;
        uint256 timeMintAfterPreMint;
        bool preMintStarted;
        bool whiteList;
        bytes32 dropMerkleRoot;
        mapping(address => bool) dropNFTtracker;
    }
    mapping(uint256 => Drop) drops;

    bytes32 private merkleRoot;

    uint256 public lastDropId;
    uint256 public totalNFTs;

    uint256 public maxSupply;
    
    string private baseTokenURI;
    
    bool public publicSaleStarted;
    bool public presaleStarted;

    mapping(address => uint256) public NFTtracker;
    
    uint256 public NFTLimitPublic;
    uint256 public NFTLimitPresale;

    uint256 public publicSalePrice;
    uint256 public presalePrice;

    event BaseURIChanged(string baseURI);
    event FreeMint(address mintTo, uint256 tokensCount);
    event SaleMint(address mintTo, uint256 tokensCount);
    event Airdrop(uint256 tokensCount);
    event NewFreeDrop(uint256 id);

    constructor(string memory baseURI, string memory name, string memory symbol, uint96 royalty) ERC721A(name, symbol) Ownable(msg.sender) {
        baseTokenURI = baseURI;
        maxSupply = 10000;
        super._setDefaultRoyalty(msg.sender, royalty);
    }

    /// @notice Modifiers

    /// @notice Check free minting event has been started
    modifier whenFreeMintStarted(uint256 dropId) {
        require(drops[dropId].preMintStarted, "Minting event has not started yet");
        _;
    }

    /// @notice Check public sale has been started
    modifier whenPublicSaleStarted() {
        require(publicSaleStarted, "Public sale has not started yet");
        _;
    }

    /// @notice Check presale has been started
    modifier whenPresaleStarted() {
        require(presaleStarted, "Presale has not started yet");
        _;
    }

    /** @notice Sale Mint
        Use Sale Mint functionality to sale NFTs on any platform for set price
    */

    /// @notice Mint NFT to connected wallet for set price without whiteList
    /// @param quantity is quantity of NFTs you are minting
    function PublicMint(uint256 quantity) external payable whenPublicSaleStarted nonReentrant  {
        require(totalSupply() + quantity <= maxSupply, "Exceeded max NFTs amount");
        require(NFTtracker[msg.sender] + quantity <= NFTLimitPublic + NFTLimitPresale, "Minting would exceed wallet limit");
        require(publicSalePrice * quantity <= msg.value, "Fund amount is incorrect");
        _safeMint(msg.sender, quantity);
        totalNFTs += quantity;
        NFTtracker[msg.sender] += quantity;

        emit SaleMint(msg.sender, quantity); 
    }

    /// @notice Mint NFT to connected wallet for set price with whiteList
    /// @param quantity is quantity of NFTs you are minting
    /// @param proof is Merkle proof of leaf from address
    function PresaleMint(uint256 quantity, bytes32[] calldata proof) external payable whenPresaleStarted nonReentrant  {
        require(NFTtracker[msg.sender] + quantity <= NFTLimitPresale, "Minting would exceed wallet limit");
        require(totalSupply() + quantity <= maxSupply, "Exceeded max NFTs amount");
        require(presalePrice * quantity <= msg.value, "Fund amount is incorrect");
        require(checkInWhitelist(proof, 0), "Presale must be minted from our website");
        totalNFTs += quantity;
        NFTtracker[msg.sender] += quantity;
        _safeMint(msg.sender, quantity);

        emit SaleMint(msg.sender, quantity); 
    }

    /// @notice Sale settings

    ///@notice Set new prices for sale
    ///@param _newPublicSalePrice is new public NFT price
    ///@param _newPresalePrice is new presale NFT price
    function setPrices(uint256 _newPublicSalePrice, uint256 _newPresalePrice) public onlyOwner {
        publicSalePrice = _newPublicSalePrice;
        presalePrice = _newPresalePrice;
    }

    ///@notice Set new limits for sale
    ///@param _newLimitPublic is new public NFT limit for one wallet
    ///@param _newLimitPresale is new presale NFT limit for one wallet
    function setNFTLimits(uint256 _newLimitPublic, uint256 _newLimitPresale) public onlyOwner {
        NFTLimitPublic = _newLimitPublic;
        NFTLimitPresale = _newLimitPresale;
    }

    ///@notice Set new max supply
    ///@param _maxSupply is new max supply value
    function setNFTHardcap(uint256 _maxSupply) public onlyOwner {
        maxSupply = _maxSupply;
    }

    ///@notice Toggle public sale state
    function togglePublicSaleStarted() external onlyOwner {
        publicSaleStarted = !publicSaleStarted;
    }

    ///@notice Toggle presale state
    function togglePresaleStarted() external onlyOwner {
        presaleStarted = !presaleStarted;
    }

    /** @notice Airdrop
        Use Airdrop to distribute any quntity of NFT to address list
        You can use airdrop function to banch mint, for doing this input only one address in address list
    */

    /// @notice Airdrop mint NFT to address list
    /// @param quantity is quantity of NFTs you are minting to one address
    /// @param receivers is list of addresses
    function airdrop(uint256 quantity, address[] calldata receivers) external onlyOwner {
        require(totalSupply() + quantity * receivers.length <= maxSupply, "Exceeded max NFTs amount");
        for (uint256 i = 0; i < receivers.length; i++)
            _safeMint(receivers[i], quantity);
        totalNFTs += quantity * receivers.length;
        
        emit Airdrop(quantity);
    }

    /** @notice Free Mint
        Use Free Mint functionality for full free or whitelisted events, where user mint NFT by himself
        Alow mint only 1 NFT to address
    */

    /// @notice Mint one free NFT to connected wallet
    /// @param proof is Merkle proof of leaf from address
    function freeMint(bytes32[] calldata proof, uint256 dropId) external whenFreeMintStarted(dropId) nonReentrant {
        if (drops[dropId].timePreMintStart + drops[dropId].timeMintAfterPreMint > block.timestamp) {
            require(drops[dropId].totalDropSupply <= drops[dropId].preMintMaxSupply, "Exceeded max premint NFTs amount");
            if (drops[dropId].whiteList)
                require(checkInWhitelist(proof, dropId), "Your address is not in the whitelist");
        }
        require(drops[dropId].totalDropSupply <= drops[dropId].maxDropSupply, "Exceeded max NFTs amount");
        require(!drops[dropId].dropNFTtracker[msg.sender], "Minting would exceed wallet limit");
        drops[dropId].dropNFTtracker[msg.sender] = true;
        drops[dropId].totalDropSupply++;
        totalNFTs++;
        _safeMint(msg.sender, 1);

        emit FreeMint(msg.sender, 1);
    }

    /// @notice Free Mint Settings

    /// @notice Switch collection status
    function startFreeMint(uint256 dropId) external onlyOwner {
        drops[dropId].timePreMintStart = block.timestamp;
        drops[dropId].preMintStarted = true;
    }

    /// @notice Stop minting event
    function stopFreeMint(uint256 dropId) external onlyOwner {
        drops[dropId].preMintStarted = false;
    }

    /** @notice Set new drop for collection
        @param _preMintMaxSupply is new preMint max supply value
        @param _maxSupply is new max supply value
        @param _timeMintAfterPreMint is time between starting preMint and starting Mint in unix
        @param _merkleRoot is merkle root generated from whitelist addresses
    */
    function setNewDrop(uint256 _preMintMaxSupply, uint256 _maxSupply, uint256 _timeMintAfterPreMint, bool _whiteList, bytes32 _merkleRoot) public onlyOwner {
        lastDropId++;
        drops[lastDropId].preMintMaxSupply = _preMintMaxSupply;
        drops[lastDropId].maxDropSupply = _maxSupply;
        drops[lastDropId].timeMintAfterPreMint = _timeMintAfterPreMint;
        drops[lastDropId].whiteList = _whiteList;
        drops[lastDropId].dropMerkleRoot = _merkleRoot;
        maxSupply += _maxSupply;

        emit NewFreeDrop(lastDropId);
    }

    ///@notice Set new PreMint MaxSupply
    ///@param _preMintMaxSupply is new preMint max supply value
    function setNewPreMintMaxSupply(uint256 _preMintMaxSupply, uint256 dropId) public onlyOwner {
        drops[dropId].preMintMaxSupply = _preMintMaxSupply;
    }

    ///@notice Set new drop Max Supply
    ///@param _maxSupply is new max supply value
    function setNewMaxSupply(uint256 _maxSupply, uint256 dropId) public onlyOwner {
        drops[dropId].maxDropSupply = _maxSupply;
    }

    ///@notice Set new time Mint After PreMint
    ///@param _timeMintAfterPreMint is time between starting preMint and starting Mint in unix
    function setNewTimeMintAfterPreMint(uint256 _timeMintAfterPreMint, uint256 dropId) public onlyOwner {
        drops[dropId].timeMintAfterPreMint = _timeMintAfterPreMint;
    }

    ///@notice Set WhiteList state
    ///@param _whiteList is state which set use WhiteList or not
    function setWhiteListState(bool _whiteList, uint256 dropId) public onlyOwner {
        drops[dropId].whiteList = _whiteList;
    }

    ///@notice Set new dropMerkleRoot
    ///@param _merkleRoot is merkle root generated from whitelist addresses
    function setNewMerkleRoot(bytes32 _merkleRoot, uint256 dropId) public onlyOwner {
        drops[dropId].dropMerkleRoot = _merkleRoot;
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

    function checkInWhitelist (bytes32[] calldata proof, uint256 dropId) internal view returns (bool) {
        bytes32 _merkleRoot;
        if (dropId == 0)
            _merkleRoot = merkleRoot;
        else _merkleRoot = drops[dropId].dropMerkleRoot;
        bytes32 leaf = keccak256(abi.encode(msg.sender));
        bool verified = MerkleProof.verify(proof, _merkleRoot, leaf);
        return verified;
    }
}
