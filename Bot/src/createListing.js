const { Chain, OpenSeaSDK } = require('opensea-js')
const { AlchemyProvider, ethers } = require('ethers')
const fs = require('fs')
const encryptedWallets = require('../data/encryptedWallets.json')
const listingHashes = require('../data/listingHashes.json')
const owners = require('../data/myNftOwners.json')
const dotenv = require('dotenv')
dotenv.config()

async function createListing(walletAddress, tokenId, listingAmount, ownerId) {

    const provider = new AlchemyProvider("matic", process.env.ALCHEMY_API_KEY)
    const walletKey = encryptedWallets[ethers.getAddress(walletAddress)]
    const walletMainnet = new ethers.Wallet(
        walletKey,
        provider
    )

    const sdk = new OpenSeaSDK(
        walletMainnet, {
            chain: Chain.Polygon,
            apiKey: process.env.OPENSEA_API_KEY,
        },
        (line) => console.info(`MAINNET: ${line}`),
    );

    let tokenAddress = process.env.NFT_CONTRACT_ADDRESS

    const listing = {
        accountAddress: walletAddress,
        startAmount: listingAmount,
        asset: {
            tokenAddress: tokenAddress,
            tokenId: tokenId,
        },
    }

    try {
        const response = await sdk.createListing(listing)
        console.log("Successfully created a listing with orderHash: ", response.orderHash)
        const newListing = { addressFrom: walletAddress, tokenId: tokenId, price: listingAmount }
        owners[ownerId]["listingNFT"]["amount"]++
        owners[ownerId]["listingNFT"]["tokenIds"].push(tokenId)
        listingHashes[response.orderHash] = newListing
        fs.writeFile("./data/nftOwners.json", JSON.stringify(owners), { flag: "w" }, function (err) { if (err) console.log(err) })
        fs.writeFile("./data/listingHashes.json", JSON.stringify(listingHashes), { flag: "w" }, function (err) { if (err) console.log(err) })
        return ({ hash: response.orderHash, protocolAddress: response.protocolAddress })
    } catch (error) {
        console.error("Error in createListing:", error)
    }
}
module.exports.createListing = createListing;
