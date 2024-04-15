
const dotenv = require('dotenv')
dotenv.config()
var api = require("polygonscan-api").init(process.env.POLYGONSCAN_API_KEY);

async function getMintTransactions() {
    try {
        let Info = []
        let mintTrxs = []
        let addresses = []
        const data = await api.account.txlist(process.env.NFT_CONTRACT_ADDR, 'latest', 0, 1, 2000, 'desc');
        let i = 0
        while (mintTrxs.length < 200) {
            if (data.result[i]["methodId"] == "0x88d15d50" && data.result[i]["isError"] == "0") {
                mintTrxs.push(data.result[i])
            }
            i++
        }
        for (let i = 0; i < 200; i++) {
            addresses.push(mintTrxs[i].from)
        }
        let totalSold = 0
        addresses.forEach(async add => {
            let info = {}
            let events
            let _response
            let sales = 0
            const options = {
                method: 'GET',
                headers: { accept: 'application/json', 'x-api-key': 'f45a6d8840e543e382dba2c25e0069b3' }
            };

            await fetch('https://api.opensea.io/api/v2/events/accounts/' + add + '?event_type=sale', options)
                .then(response => response.json())
                .then(response => {
                    _response = response
                })
                .catch(err => console.error(err));
            if (_response && _response["asset_events"] && await _response["asset_events"].length != 0) {
                for (let j = 0; j < await _response["asset_events"].length; j++) {
                    if (await _response.asset_events[j]["nft"]["contract"])
                        if (await _response.asset_events[j]["nft"]["contract"] == process.env.NFT_CONTRACT_ADDR) {
                            sales++
                            console.log("AAAAAAAAA" + _response.asset_events[j]["nft"]["inftidentifier"])
                        }
                }
            }
            console.log(`Wallet ${add} sold nft ${sales} times`)
            totalSold += sales
        })
        console.log(`Wallet${totalSold} `)
        


        for (let i = 0; i < Info.length; i++) {
            for (let j = 1; i < Info.length; i++) {
                if (Info[i]["sales"] < Info[j]["sales"]) {
                    const s = Info[i]["sales"]
                    Info[i]["sales"] = Info[j]["sales"]
                    Info[j]["sales"] = s
                }
            }
        }

        console.log(Info)

    } catch (err) {
        console.log(err)
    }
}

async function getNftTrades(address) {
    let sales = 0

    try {
        let info = {}
        let events
        let _response
        const options = {
            method: 'GET',
            headers: { accept: 'application/json', 'x-api-key': 'f45a6d8840e543e382dba2c25e0069b3' }
        };

        await fetch('https://api.opensea.io/api/v2/events/accounts/' + address + '?event_type=sale', options)
            .then(response => response.json())
            .then(response => {
                _response = response
            })
            .catch(err => console.error(err));
        if (_response && _response["asset_events"] && await _response["asset_events"].length != 0) {
            for (let j = 0; j < await _response["asset_events"].length; j++) {
                if (await _response.asset_events[j]["nft"]["contract"])
                    if (await _response.asset_events[j]["nft"]["contract"] == process.env.NFT_CONTRACT_ADDR) {
                        sales++
                        console.log("AAAAAAAAA" + _response.asset_events[j]["nft"]["inftidentifier"])
                    }
            }
        }
        // console.log(_response.asset_events[0])        

    }
    catch (err) {
        console.log(err)
    }

    return (sales)

}

getMintTransactions() 