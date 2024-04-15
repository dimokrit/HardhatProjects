const { ethers, AlchemyProvider } = require("ethers");
const dotenv = require('dotenv')
const sdk = require('api')('@opensea/v2.0#eigd8j2ilubykzr5');
const fs = require('fs')
const abi = require("../data/abi/openseaABI.json")
const encryptedWallets = require('../data/encryptedWallets.json')
const listingHashes = require('../data/listingHashes.json')
const owners = require('../data/myNftOwners.json')
dotenv.config()

async function buyListedItem(hash, fulfiller, protocolAddress, ownerId, fulfillerId, tokenId) {
    const provider = new AlchemyProvider("matic", process.env.ALCHEMY_API_KEY)
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
        owners[ownerId]["listingNFT"]["amount"]--;
        owners[ownerId]["storingNFT"]["amount"]--;
        owners[ownerId]["listingNFT"]["tokenIds"].splice(owners[ownerId]["listingNFT"]["tokenIds"].indexOf(tokenId, 0), 1)
        owners[ownerId]["storingNFT"]["tokenIds"].splice(owners[ownerId]["storingNFT"]["tokenIds"].indexOf(tokenId, 0), 1)
        owners[ownerId]["sales"]++;
        owners[fulfillerId]["storingNFT"]["amount"]++;
        owners[fulfillerId]["storingNFT"]["tokenIds"].push(tokenId)
        owners[fulfillerId]["boughts"]++;

        fs.writeFile("./data/nftOwners.json", JSON.stringify(owners), { flag: "w" }, function (err) { if (err) console.log(err) })
        fs.writeFile("./data/listingHashes.json", JSON.stringify(listingHashes), { flag: "w" }, function (err) { if (err) { console.log(err) } })
        console.log("Fulfill listing transaction is success tx: " + tx.hash)
    } catch (e) {
        console.log(e)
    }
}

module.exports.buyListedItem = buyListedItem