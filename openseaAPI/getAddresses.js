const fs = require('fs');
const wallets = require("./wallets/wallets.json")
const amount = 50
async function getAddresses() {
    let _addresses = []
   for (let i=0; i <amount; i++) {
    _addresses.push(wallets[i].address)
    fs.writeFile("./addresses.txt", wallets[i].address + '\n', {flag:"a"}, function(err) {
        if (err) {
            console.log(err);
        }})
   
   }
   console.log(_addresses)
}

getAddresses()