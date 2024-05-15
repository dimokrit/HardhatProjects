const { Chain, OpenSeaSDK } = require('opensea-js')
const { ethers } = require('ethers')
const { decrypt } = require('./decryptWallet.js')
const dotenv = require('dotenv')
dotenv.config()

async function createOffer(walletAddress, tokenId, price, provider) {
    try {
        const tokenAddress = process.env.NFT_CONTRACT_ADDRESS;
        const collectionSlug = process.env.COL_SLUG
        const walletKey = decrypt(ethers.getAddress(walletAddress))

        const walletMainnet = new ethers.Wallet(
            walletKey,
            provider
        )

        const sdk = new OpenSeaSDK(
            walletMainnet,
            {
                chain: Chain.Polygon,
                apiKey: process.env.OPENSEA_API_KEY,
            },
            (line) => console.info(`MAINNET: ${line}`),
        )

        if (price == 0) {
            const bestOffer = await sdk.api.getBestOffer(collectionSlug, tokenId);
            console.log(bestOffer['price']['value'])
            price = (Number(bestOffer['price']['value']) + 100000000000000) / 10 ** 18
        }
        console.log(price)
        const offer = {
            accountAddress: walletAddress,
            startAmount: price,
            asset: {
                tokenAddress: tokenAddress,
                tokenId: tokenId,
            }
        }

        const response = await sdk.createOffer(offer)
        console.log("Successfully created an offer with orderHash:", response.orderHash)
    } catch (error) {
        console.error("Error in createOffer:", error)
    }
}

module.exports.createOffer = createOffer