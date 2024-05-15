const { ethers } = require("ethers");
const dotenv = require('dotenv')
const sdk = require('api')('@opensea/v2.0#eigd8j2ilubykzr5');
const { decrypt } = require('./decryptWallet.js')
const { pool } = require('../db/postgresModel.js')
const abi = require("../data/abi/openseaABI.json")
dotenv.config()

async function buyOneItem(hash, fulfiller, owner, tokenId, protocolAddress, provider) {
    try {
        sdk.auth(process.env.OPENSEA_API_KEY);
        let param;
        let _value;

        const walletKey = decrypt(ethers.getAddress(fulfiller))
        const signer = new ethers.Wallet(walletKey, provider)
        await sdk.generate_listing_fulfillment_data_v2({
            listing: { chain: 'matic', protocol_address: protocolAddress, hash: hash },
            fulfiller: { address: fulfiller }
        }).then(({ data }) => {
            _value = data["fulfillment_data"]["transaction"]["value"]
            param = data["fulfillment_data"]["transaction"]["input_data"]["parameters"];
        }).catch(err => console.error(err));

        const { considerationToken,
            considerationIdentifier,
            considerationAmount,
            offerer,
            zone,
            offerToken,
            offerIdentifier,
            offerAmount,
            basicOrderType,
            startTime,
            endTime,
            zoneHash,
            salt,
            offererConduitKey,
            fulfillerConduitKey,
            totalOriginalAdditionalRecipients,
            additionalRecipients,
            signature } = param

        const contract = new ethers.Contract(protocolAddress, abi, signer)

        const tx = await contract.fulfillBasicOrder_efficient_6GL6yc([
            considerationToken,
            parseInt(considerationIdentifier),
            BigInt(considerationAmount),
            offerer,
            zone,
            offerToken,
            parseInt(offerIdentifier),
            parseInt(offerAmount),
            basicOrderType,
            parseInt(startTime),
            parseInt(endTime),
            zoneHash,
            parseInt(salt),
            offererConduitKey,
            fulfillerConduitKey,
            parseInt(totalOriginalAdditionalRecipients),
            additionalRecipients,
            signature],
            { value: BigInt(_value) }
        )
        await pool.query(`UPDATE mywallets SET nftAmount = nftAmount - 1, nftIds = array_remove(nftIds, ${tokenId}) WHERE address = '${owner}'`)
        await pool.query(`UPDATE mywallets SET nftAmount = nftAmount + 1, nftIds = array_append(nftIds, ${tokenId}) WHERE address = '${fulfiller}'`)
        await pool.query(`UPDATE nfts SET owner = '${fulfiller}', path = array_append(path, '${fulfiller}') WHERE nftId = ${tokenId}`)

        const green = '\x1b[32m%s\x1b[0m'
        console.log(green, "Fulfill listing transaction is success tx: " + tx.hash)
    } catch (e) {
        console.log('Buying error:' + e)
    }
}

module.exports.buyOneItem = buyOneItem