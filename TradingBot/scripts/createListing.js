const { Chain, OpenSeaSDK } = require('opensea-js')
const { ethers } = require('ethers')
const { decrypt } = require('./decryptWallet.js')
const dotenv = require('dotenv')
dotenv.config()

async function createListing(walletAddress, tokenId, price, provider) {
    try {
        const walletKey = decrypt(ethers.getAddress(walletAddress))

        const walletMainnet = new ethers.Wallet(
            walletKey,
            provider
        )

        const sdk = new OpenSeaSDK(
            walletMainnet,
            {
                chain: Chain.Polygon,
                apiKey: process.env.OPENSEA_API_KEY
            },
            (line) => console.info(`MAINNET: ${line}`)
        )

        let tokenAddress = process.env.NFT_CONTRACT_ADDRESS

        const listing = {
            accountAddress: walletAddress,
            startAmount: price,
            asset: {
                tokenAddress: tokenAddress,
                tokenId: tokenId,
            }
        }

        const response = await sdk.createListing(listing)

        const green = '\x1b[32m%s\x1b[0m'
        console.log(green, `Successfully created a listing with orderHash: ${response.orderHash}`)
        return ({ hash: response.orderHash, protocolAddress: response.protocolAddress })
    } catch (error) {
        console.error("Error in createListing:", error)
    }
}
module.exports.createListing = createListing;