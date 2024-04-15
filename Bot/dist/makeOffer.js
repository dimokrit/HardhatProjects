const abi = require("./abi.json")
const ethers = require("ethers");
const dotenv = require('dotenv')
const sdk = require('api')('@opensea/v2.0#eigd8j2ilubykzr5');
const addresses = require("../addresses.json")
const hashes = require("../hashes.json")
dotenv.config()

const provider = new ethers.JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY)
const signer = new ethers.Wallet(process.env.WALLET_PRIV_KEY, provider)

async function makeOffer() {
    sdk.auth(process.env.OPENSEA_API_KEY);
    let param;
    let _value;
    const fulfiller = addresses[0]["address"]

    sdk.server('https://api.opensea.io');
    sdk.get_all_listings_on_collection_v2({ collection_slug: process.env.COL_ID })
        .then(({ data }) => {

            console.log(data["listings"][0]["protocol_data"]["parameters"]["offer"][0]["identifierOrCriteria"])
        })
        .catch(err => console.error(err));

    // const { considerationToken,
    //     considerationIdentifier,
    //     considerationAmount,
    //     offerer,
    //     zone,
    //     offerToken,
    //     offerIdentifier,
    //     offerAmount,
    //     basicOrderType,
    //     startTime,
    //     endTime,
    //     zoneHash,
    //     salt,
    //     offererConduitKey,
    //     fulfillerConduitKey,
    //     totalOriginalAdditionalRecipients,
    //     additionalRecipients,
    //     signature } = param
    // const nagaNFT_Contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

    // try {
    //     const tx = await nagaNFT_Contract.fulfillBasicOrder_efficient_6GL6yc([
    //         considerationToken,
    //         parseInt(considerationIdentifier),
    //         BigInt(considerationAmount),
    //         offerer,
    //         zone,
    //         offerToken,
    //         parseInt(offerIdentifier),
    //         parseInt(offerAmount),
    //         basicOrderType,
    //         parseInt(startTime),
    //         parseInt(endTime),
    //         zoneHash,
    //         parseInt(salt),
    //         offererConduitKey,
    //         fulfillerConduitKey,
    //         parseInt(totalOriginalAdditionalRecipients),
    //         additionalRecipients,
    //         signature
    //     ], { value: BigInt(_value) }
    //     );
    //     console.log("Transaction is success \n" + tx.hash)
    // } catch (e) {
    //     console.log(e)
    // }
}

makeOffer()