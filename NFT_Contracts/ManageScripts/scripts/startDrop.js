const abi = require("../ab.json")
const hre = require("hardhat");
const dotenv = require('dotenv')
dotenv.config()

const provider = new hre.ethers.JsonRpcProvider(process.env.POLYGON_INFURA_KEY)
const signer = new hre.ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider)

async function startDrop() {
    const nagaNFT_Contract = new hre.ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);
    try {
        const tx = await nagaNFT_Contract.fulfillBasicOrder_efficient_6GL6yc([
            "0x0000000000000000000000000000000000000000",
            0,
            97500000000000000n,
            "0x47863f4d1efb787e913b7aa16f234a343439c6cc",
            "0x0000000000000000000000000000000000000000",
            "0xbc349c8e7c2b4dc9afac386fb916ad1419d71587",
            0,
            1,
            1,
            1711833366,
            1714425367,
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            0,
            "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
            "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
            1,
            [
                {
                  "amount": "2500000000000000",
                  "recipient": "0x0000a26b00c1f0df003000390027140000faa719"
                }
              ],
            "0xb9b84fc30eeb58d695a36e05254b9768ce2db3069c5928040628899d5a6f40c2f79f496ebd485c85f9b8bdae8841dee24ff544a7ec86b18c1383c503d8821c96"
        ], { value: 100000000000000000n }
        );
        console.log("Transaction is success \n" + tx.hash)
    } catch (e) {
        console.log(e)
    }
}

startDrop()