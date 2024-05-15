const { AlchemyProvider, ethers } = require('ethers')
const fs = require('fs')
const encryptedWallets = require('../data/encryptedWallets.json')
const owners = require('../data/myNftOwners.json')
const abi = require('../data/abi/nftContractABI.json')
const dotenv = require('dotenv')
dotenv.config()
async function mint(walletAddress, tokenId, provider) {
    const tokenAddress = process.env.NFT_CONTRACT_ADDRESS;
    const signer = new ethers.Wallet(
        privateKey,
        provider
    )
    const contract = new ethers.Contract(tokenAddress, abi, signer);
    try {
        const tx = await contract.freeMint()
        const newOwner =  {
            "address": walletAddress,
            "storingNFT": {
                "amount": 1,
                "tokenIds": [
                    tokenId
                ]
            },
            "listingNFT": {
                "amount": 0,
                "tokenIds": []
            },
            "sales": 0,
            "boughts": 0
        }
        owners.push(newOwner)
        fs.writeFile("./data/myNftOwners.json", JSON.stringify(owners), { flag: "w" }, function (err) { if (err) console.log(err) })
        console.log(`Successfully minted by ${walletAddress}`)
        console.log(`Transaction hash: ${tx.hash}`)
    } catch (error) {
        console.error("Error in createOffer:", error)
    }
}

module.exports.mint = mint