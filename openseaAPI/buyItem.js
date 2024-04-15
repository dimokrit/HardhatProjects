const abi = require("./abi.json")
const ethers = require("ethers");
const dotenv = require('dotenv')
const sdk = require('api')('@opensea/v2.0#eigd8j2ilubykzr5');
const addresses = require("../addresses.json")
const hashes = require("../hashes.json")
dotenv.config()

const provider = new ethers.JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY)
const signer = new ethers.Wallet(process.env.WALLET_PRIV_KEY, provider)

async function buyListedItem() {
    sdk.auth(process.env.OPENSEA_API_KEY);
    let param;
    let _value;
    const fulfiller = addresses[0]["address"]
    const hash = hashes["myListed"][0];
    await sdk.generate_listing_fulfillment_data_v2({
        listing: { chain: 'matic', protocol_address: '0x00000000000000adc04c56bf30ac9d3c0aaf14dc', hash: hash },
        fulfiller: { address: fulfiller }
    }).then(({ data }) => {
            _value = data["fulfillment_data"]["transaction"]["value"]
            param = data["fulfillment_data"]["transaction"]["input_data"]["parameters"];
            console.log(param)
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
    const nagaNFT_Contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

    try {
        const tx = await nagaNFT_Contract.fulfillBasicOrder_efficient_6GL6yc([
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
            signature
        ], { value: BigInt(_value) }
        );
        console.log("Transaction is success \n" + tx.hash)
    } catch (e) {
        console.log(e)
    }
}

buyListedItem()