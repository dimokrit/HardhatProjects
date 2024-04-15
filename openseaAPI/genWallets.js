const dotenv = require('dotenv')
const ethers = require("ethers");
const fs = require('fs');
const { Web3 } = require('web3');
const web3 = new Web3("https://polygon-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY)
dotenv.config()


async function genWallets() {
    const wallet = web3.eth.accounts.wallet.create(100);
    console.log(wallet)
    fs.writeFile("./wallets.json", JSON.stringify(wallet), function(err) {
        if (err) {
            console.log(err);
        }
    });
}

genWallets()