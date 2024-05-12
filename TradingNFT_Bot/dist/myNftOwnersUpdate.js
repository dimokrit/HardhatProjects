const { AlchemyProvider, ethers } = require('ethers')
const fs = require('fs')
const encryptedWallets = require('../data/encryptedWallets.json')
const nfts = require('../data/nfts.json')
const abi = require('../data/abi/nftContractABI.json')
const dotenv = require('dotenv')
dotenv.config()
async function myNftOwnersUpdate(provider) {

    const tokenAddress = process.env.NFT_CONTRACT_ADDRESS;
    const signer = new ethers.Wallet(
        process.env.OWNER_PRIVATE_KEY,
        provider
    )
    const contract = new ethers.Contract(tokenAddress, abi, signer);
    try {
        let ownersList = []
        let amounts = {}
        let tokenIds = {}
        let ownerIds = {}

        let owners = {
            "storing": [],
            "empty": []
        }


        for (let i = 0; i < nfts.length; i++) {
            const owner = await contract.ownerOf(i)

            if (amounts[owner]) {
                amounts[owner]++
                owners["storing"][ownerIds[owner]]["storingNFT"]["amount"]++
                owners["storing"][ownerIds[owner]]["storingNFT"]["tokenIds"].push(i)
                tokenIds[owner].push(i)
            }
            else {
                amounts[owner] = 1
                tokenIds[owner] = [i]
                ownerIds[owner] =  owners["storing"].length
                let storing = {
                    "address": owner,
                    "storingNFT": {
                        "amount": 1,
                        "tokenIds": [i]
                    },
                    "listingNFT": {
                        "amount": 0,
                        "tokenIds": []
                    },
                    "sales": 0,
                    "boughts": 0
                }
    
                owners["storing"].push(storing)
                ownersList.push(owner)
            }

            console.log(`Owner ${owner} of ${i} is updated`)
        }
        let n = 0
        for (const [key, value] of Object.entries(encryptedWallets)) {
            if (n >= 42) break

            if (!ownersList.includes(key)) {
                const newEmpty = {
                    "address": key,
                    "storingNFT": {
                        "amount": 0,
                        "tokenIds": []
                    },
                    "listingNFT": {
                        "amount": 0,
                        "tokenIds": []
                    },
                    "sales": 0,
                    "boughts": 0
                }

                owners["empty"].push(newEmpty)
                console.log(`Empty owner ${key} is pushed`)
            }
            n++
        }
        fs.writeFile("./data/myNftOwners.json", JSON.stringify(owners), { flag: "w" }, function (err) { if (err) console.log(err) })
        console.log('success!!!')
    } catch (error) {
        console.error("Error in createOffer:", error)
    }
}

module.exports.myNftOwnersUpdate = myNftOwnersUpdate;