const fs = require('fs');
const dotenv = require('dotenv')
const ethers = require("ethers");
dotenv.config()

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_INFURA_KEY)
const signer = new ethers.Wallet(process.env.WALLET_PRIV_KEY, provider)

async function getNatureCount() {
    let MM_Amount = 0
    let organicAmount = 0
    let MM_Holders = 0
    let Organic_Holders = 0
    let organicUsers = { "Type": "MM" }
    let mmUsers = { "Type": "MM" }
    const _addresses = fs.readFileSync("./MM_Addresses.txt", 'utf-8').toString().split("\n")
    console.log(_addresses)
    const abi = [
        { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
        { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }]
    const contract = new ethers.Contract(process.env.NFT_CONTRACT_ADDR, abi, signer)

    for (let i = 0; i < 501; i++) {
        try {
            const address = await contract.ownerOf(i)
            if (_addresses.includes(address+"\r")) {
                if (mmUsers[address] === undefined) {
                    mmUsers[address] = "1";
                    MM_Holders++;
                } else {
                    const newAmount = Number(mmUsers[address]) + 1
                    mmUsers[address] = newAmount.toString();
                }
                MM_Amount++;
                console.log("MM: " + address + " owns tokenId:" + i)
            }
            else {
                if (organicUsers[address] === undefined) {
                    organicUsers[address] = "1";
                    Organic_Holders++
                } else {
                    const newAmount = Number(organicUsers[address]) + 1
                    organicUsers[address] = newAmount.toString();
                }
                organicAmount++;
                console.log("ORG: " + address + " owns tokenId:" + i)
            }
        } catch {
            i--
        }
    }
    console.log("_______________________")
    console.log("Total organic: " + organicAmount)
    console.log("Total organic Holders: " + Organic_Holders)
    console.log(JSON.stringify(organicUsers))
    console.log("_______________________")
    console.log("Total MM: " + MM_Amount)
    console.log("Total MM Holders: " + MM_Holders)
    console.log(JSON.stringify(mmUsers))
}

getNatureCount()