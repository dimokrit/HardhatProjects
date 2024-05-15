const fs = require("fs")
const crypto = require('crypto');
const walletsWithKey = require("../data/walletsWithKey.json")
const { pool } = require('../db/postgresModel.js')
const { ethers } = require('ethers')

async function encryptWallets() {
    const algorithm = 'aes256';
    const key = crypto.randomBytes(16).toString('hex');

    await pool.query(`DELETE FROM encryptedwallets`)

    let _encryptedWallets = {}
    for (let i = 0; i < walletsWithKey.length; i++) {
        const address = ethers.getAddress(walletsWithKey[i].address)
        const privateKey = walletsWithKey[i].privateKey
        const encryptedPrivateKey = encryptKey(privateKey)
        _encryptedWallets[address] = encryptedPrivateKey

        await pool.query(`INSERT INTO encryptedwallets (address, privateKey) VALUES ('${address}', '${encryptedPrivateKey}')`)
    }

    function encryptKey(data) {
        const iv = crypto.randomBytes(8).toString('hex');
        const cipher = crypto.createCipheriv(algorithm, key, iv); 
    
        let encrypted = cipher.update(data, 'utf8', 'hex')
        encrypted += cipher.final('hex')
        return `${encrypted}:${iv}`;
    }
    await pool.query(`DELETE FROM keys`)
    await pool.query(`INSERT INTO keys (cipherKey, cipherAlgorithm) VALUES ('${key}', '${algorithm}')`)

    fs.writeFile("./data/keys.json", JSON.stringify({key, algorithm}), function (err) { if (err) console.log(err) })
    fs.writeFile("./data/encryptedWallets.json", JSON.stringify(_encryptedWallets), {flag:"w"}, function (err) { if (err) console.log(err) })
}

module.exports.encryptWallets = encryptWallets