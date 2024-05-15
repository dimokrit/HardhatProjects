const { ethers } = require('ethers')
const abi = require('../data/abi/nftContractABI.json')
const dotenv = require('dotenv')
const { pool } = require('../db/postgresModel.js')

dotenv.config()
async function updateNftData(usingWalletsCount, provider) {
    try {
        const tokenAddress = process.env.NFT_CONTRACT_ADDRESS;
        const signer = new ethers.Wallet(
            process.env.OWNER_PRIVATE_KEY,
            provider
        )

        const contract = new ethers.Contract(tokenAddress, abi, signer);
        const totalSupply = Number(await contract.totalSupply())
        const yellow = '\x1b[33m%s\x1b[0m'
        console.log(yellow, `Total supply: ${totalSupply}`)

        await pool.query(`DELETE FROM mywallets`)
        await pool.query(`DELETE FROM nfts`)

        await pool.query(`ALTER SEQUENCE mywallets_id_seq RESTART WITH 1`)

        for (let i = 0; i < totalSupply; i++) {
            const owner = await contract.ownerOf(i)

            const res = await pool.query(`SELECT COUNT(*) FROM mywallets WHERE address = '${owner}'`)
            const count = res.rows[0]['count']
            const exist = count > 0
            let myAddress

            if (exist) {
                await pool.query(`UPDATE mywallets SET nftAmount = nftAmount + 1, nftIds = array_append(nftIds, ${i}) WHERE address = '${owner}'`)
                myAddress = true;
            } else {
                const _res = await pool.query(`SELECT COUNT(*) FROM encryptedwallets WHERE address = '${owner}'`)
                const _count = _res.rows[0]['count']
                myAddress = _count > 0
                if (myAddress) await pool.query(`INSERT INTO mywallets (address, used, nftAmount, nftIds) VALUES ('${owner}', TRUE, 1, ARRAY[${i}])`)
            }

            const __res = await pool.query(`SELECT COUNT(*) FROM nfts WHERE nftId = ${i}`)
            const __count = __res.rows[0]['count']
            const __exist = __count > 0

            if (__exist)
                await pool.query(`UPDATE nfts SET owner = '${owner}' WHERE nftId = ${i}`)
            else
                await pool.query(`INSERT INTO nfts (nftId, my, owner, path) VALUES (${i}, ${myAddress}, '${owner}', ARRAY['${owner}'])`)

            console.log(`NFT #${i} is scanned. Owner is ${owner}`)
        }

        const res = await pool.query(`SELECT COUNT(*) FROM encryptedwallets`)
        const walletsCount = res.rows[0]['count']

        for (let j = 1; j <= walletsCount; j++) {
            const resAdd = await pool.query(`SELECT address FROM encryptedwallets WHERE id = '${j}'`)
            const address = resAdd.rows[0]['address']

            const res = await pool.query(`SELECT COUNT(*) FROM mywallets WHERE address = '${address}'`)
            const count = res.rows[0]['count']
            const owns = count > 0
            if (!owns) {
                const used = j <= usingWalletsCount
                await pool.query(`INSERT INTO mywallets (address, used, nftAmount) VALUES ('${address}', ${used}, 0)`)
            }

            console.log(`#${j} Address ${address} is added to wallets DB `)
        }
    } catch (error) {
        console.error("Error in updateNftData: ", error)
    }
}

module.exports.updateNftData = updateNftData;