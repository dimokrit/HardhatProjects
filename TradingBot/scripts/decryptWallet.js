const crypto = require('crypto');
const encryptedWallets = require("../data/encryptedWallets.json")
const keys = require("../data/keys.json")

function decrypt(address) {
    const encryptedData = encryptedWallets[address]
    const algorithm = keys['algorithm']
    const key = keys['key']
    const [encryptedString, iv] = encryptedData.split(':')
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedString, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted;
}

module.exports.decrypt = decrypt