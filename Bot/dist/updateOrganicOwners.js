const fs = require('fs')
const myOwners = require('../data/myNftOwners.json')
const dotenv = require('dotenv')
const ethers = require('ethers')
dotenv.config()

async function updateOrganicOwners() {
    let tokenAddress = process.env.NFT_CONTRACT_ADDRESS;
    const collectionSlug = process.env.COL_SLUG
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', 'x-api-key': process.env.OPENSEA_API_KEY }
    };

    let addresses = []
    for (let n = 0; n < myOwners.length; n++)
        addresses.push(ethers.getAddress(myOwners[n]['address']))
    let organicOwners = []
    let organicAddresses = []
    let ids = {}
    try {
        const _collection = await fetch(`https://api.opensea.io/api/v2/collections/${collectionSlug}`, options)
        const collection = await _collection.json()
        const totalSupply = collection['total_supply']
        for (let i = 0; i < totalSupply; i++) {
            const _nft = await fetch(`https://api.opensea.io/api/v2/chain/matic/contract/${tokenAddress}/nfts/${i}`, options)
            const nft = await _nft.json()
            const owner = nft['nft']['owners'][0]['address']
            if (addresses.includes(ethers.getAddress(owner)))
                continue
            // if (!organicAddresses.includes(owner)) {
                const newOrganicOwner = {
                    address: owner,
                    amount: 1,
                    tokenId: i
                }
                ids[owner] = organicOwners.length
                organicOwners.push(newOrganicOwner)
            // } else {
            //     organicOwners[ids[owner]]['amount']++
            //     organicOwners[ids[owner]]['tokenIds'].push(i)
            // }
        }
        fs.writeFile("./data/organicNftOwners.json", JSON.stringify(organicOwners), { flag: "w" }, function (err) { if (err) console.log(err) })
        console.log('Organic owners data updated in organicNftOwners.json')
        return organicOwners.length
    } catch (error) {
        console.error("Error in updateOrganicOwners:", error);
    }
}

module.exports.updateOrganicOwners = updateOrganicOwners