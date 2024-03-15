const { abi } = require("../artifacts/contracts/Girant_Hero_Medusa.sol/Girand_Hero_Medusa.json")
const hre = require("hardhat");
const dotenv = require('dotenv')
dotenv.config()

const provider = new hre.ethers.JsonRpcProvider(process.env.MUMBAI_INFURA_KEY)
const signer = new hre.ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider)

async function startDrop() {
    const nagaNFT_Contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);
    try {
        const tx = await nagaNFT_Contract.startPreMint();
        console.log("Transaction is success \n" + tx.hash)
    } catch (e) {
        console.log(e)
    }
}

startDrop()