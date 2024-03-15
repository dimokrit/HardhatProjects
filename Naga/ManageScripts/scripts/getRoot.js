const hre = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const dotenv = require('dotenv')
dotenv.config()
var fs = require('fs');

async function main() {
    let whitelist = fs.readFileSync("./parameters/whitelist.txt", 'utf-8').toString().replace('\r', '').split("\n");
    const abiCoder = hre.ethers.AbiCoder.defaultAbiCoder();

    function encodeLeaf(address) {
        return abiCoder.encode(
            ["address"],
            [address]
        );
    };

    let list = []
    for (let i = 0; i < whitelist.length; i++)
        list.push(encodeLeaf(whitelist[i].replace('\r', '')))

    const merkleTree = new MerkleTree(list, hre.ethers.keccak256, {
        hashLeaves: true,
        sortPairs: true,
        sortLeaves: true,
    });

    const root = merkleTree.getHexRoot();
    const leaf = ethers.keccak256(encodeLeaf(whitelist[0].replace('\r', '')));
    const proof = merkleTree.getHexProof(leaf)
    
    fs.writeFile("./parameters/whitelist.json", JSON.stringify(list), function(err) {
        if (err) {
            console.log(err);
        }
    });
    console.log("ROOT: ", root)
    console.log("whitelist.json: ", list.length)
    console.log("PROOF: ", proof)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
