const { ethers, AlchemyProvider } = require("ethers");
const dotenv = require('dotenv')
const sdk = require('api')('@opensea/v2.0#eigd8j2ilubykzr5');
const fs = require('fs')
const abi = require("../data/abi/openseaABI.json")
const encryptedWallets = require('../data/encryptedWallets.json')
const listingHashes = require('../data/listingHashes.json')
const owners = require('../data/myNftOwners.json')
const nfts = require('../data/nfts.json')
dotenv.config()

async function buyListedItem(hash, fulfiller, protocolAddress, ownerId, fulfillerId, tokenId, provider) {
    sdk.auth(process.env.OPENSEA_API_KEY);
    let param;
    let _value;

    const walletKey = encryptedWallets[ethers.getAddress(fulfiller)]
    const signer = new ethers.Wallet(walletKey, provider)
    await sdk.generate_listing_fulfillment_data_v2({
        listing: { chain: 'matic', protocol_address: protocolAddress, hash: hash },
        fulfiller: { address: fulfiller }
    }).then(({ data }) => {
        _value = data["fulfillment_data"]["transaction"]["value"]
        param = data["fulfillment_data"]["transaction"]["input_data"]["parameters"];
    })
        .catch(err => console.error(err));

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
    const contract = new ethers.Contract(protocolAddress, abi, signer);

    try {
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
        );

        delete listingHashes[hash]

        let lister =  owners["storing"][ownerId]
        let _fulfiller = owners["empty"][fulfillerId]

        lister["listingNFT"]["amount"]--;
        lister["storingNFT"]["amount"]--;
        lister["listingNFT"]["tokenIds"].splice(lister["listingNFT"]["tokenIds"].indexOf(tokenId, 0), 1)
        lister["storingNFT"]["tokenIds"].splice(0, 1)
        lister["sales"]++;

        _fulfiller["storingNFT"]["amount"]++;
        _fulfiller["storingNFT"]["tokenIds"].push(tokenId)
        _fulfiller["boughts"]++;

        console.log("ownerId: ", ownerId)
        console.log("fulfillerId: ", fulfillerId)

        
        console.log("OWNER!1 ", owners["storing"][ownerId])
        
        if (lister["storingNFT"]["amount"] < 1) {
            owners["empty"].push(lister)
            owners["storing"].splice(ownerId, 1)
            console.log("Storing address revoved")
        }
        console.log("_fulfiller ", _fulfiller)
        console.log("Amount:  _", _fulfiller["storingNFT"]["amount"])
        console.log("Con:  _", _fulfiller["storingNFT"]["amount"] > 0)
        
        if (_fulfiller["storingNFT"]["amount"] > 0) {
            owners["storing"].push(_fulfiller)
            owners["empty"].splice(fulfillerId, 1)
            console.log("Empty address revoved")
        }

        nfts[tokenId]["owner"] = fulfiller
        nfts[tokenId]["path"].push(fulfiller)

        fs.writeFile("./data/myNftOwners.json", JSON.stringify(owners), { flag: "w" }, function (err) { if (err) console.log(err) })
        fs.writeFile("./data/nfts.json", JSON.stringify(nfts), { flag: "w" }, function (err) { if (err) console.log(err) })
        fs.writeFile("./data/listingHashes.json", JSON.stringify(listingHashes), { flag: "w" }, function (err) { if (err) { console.log(err) } })
        console.log("Fulfill listing transaction is success tx: " + tx.hash)
    } catch (e) {
        console.log('Buying error:' + e)
    }
}

module.exports.buyListedItem = buyListedItem