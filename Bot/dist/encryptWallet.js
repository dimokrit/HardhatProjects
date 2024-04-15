const walletsWithKey = require("../data/walletsWithKey.json")
const encryptedWallets = require("../data/encryptedWallets.json")
const fs = require("fs")
const crypto = require('crypto');
const assert = require('assert');

const algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);  
console.log("Algorithm: ", algorithm)
console.log("Key: ", key)
console.log("Cipher: ", cipher)
async function encryptWallets() {

    let _encryptedWallets = encryptedWallets
    for (let i = 0; i < walletsWithKey.length; i++) {
        const address = walletsWithKey[i].address
        const privateKey = walletsWithKey[i].privateKey
        const encryptedPrivateKey = encryptKey(privateKey)
        const decryptedPrivateKey = decryptKey(encryptedPrivateKey)
        console.log("Adddress: ", address)
        console.log("Private Key: : ", privateKey)
        console.log("Encrypted Private Key: : ", encryptedPrivateKey)
        console.log("Decrypted Private Key: : ", decryptedPrivateKey)
        _encryptedWallets[address] = encryptedPrivateKey
    }

    fs.writeFile("./data/encryptedWallets.json", JSON.stringify(_encryptedWallets), {flag:"w"}, function(err) {
        if (err) {
            console.log(err);
    }})
}

function encryptKey(data) {
    const encrypted = cipher.update(data)
    return encrypted;
}

function decryptKey(data) {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    const decrypted = decipher.update(data, 'hex', 'utf8')
    return decrypted;
}


encryptWallets()
//console.log(decryptKey(encryptKey("12e16088cf269eb758b9e26464d85b87c71989bc3f414a2fe3d8717ca25bbbef")))