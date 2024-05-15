const { ethers } = require('ethers')
const walletsWithKey = require('../data/walletsWithKey.json')
const abi = require('../data/abi/maticABI.json')
const dotenv = require('dotenv')
dotenv.config()
async function distribution(q, amount, provider) {
    try {
        const privateKey = process.env.OWNER_PRIVATE_KEY;
        const maticAdd = "0x0000000000000000000000000000000000001010"
        const signer = new ethers.Wallet(
            privateKey,
            provider
        )
        const contract = new ethers.Contract(maticAdd, abi, signer);

        for (let i = 0; i < q; i++) {

            const walletAddress = walletsWithKey[i]['address']
            const tx = await contract.transfer(walletAddress, amount, { value: amount })

            console.log(`${ethers.formatEther(amount)} Matic successfully sent to ${walletAddress}`)
            console.log(`Transaction #${i + 1} hash: ${tx.hash}`)
        }
    } catch (error) {
        console.error("Error in distribution:", error)
    }
}

module.exports.distribution = distribution