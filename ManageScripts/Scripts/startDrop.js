const { ethers, keccak256 } = require('ethers');
const { MerkleTree } = require("merkletreejs");
const fs = require("fs");
const ABI = require("../Parameters/ABI.json");
const parameters = require("../Parameters/Parameters.json");

const abiCoder = ethers.AbiCoder.defaultAbiCoder();

function encodeLeaf(address) {
    return abiCoder.encode(
        ["address"], // The datatypes of arguments to encode
        [address] // The actual values
    );
};

const list = [
    encodeLeaf("0xbF7580BA784F12eE30edC6ea17d282f61723fBee"),
];

const merkleTree = new MerkleTree(list, keccak256, {
    hashLeaves: true,
    sortPairs: true,
    sortLeaves: true,
});

fs.writeFileSync('./src/modules/Web3/whiteList.json', JSON.stringify(list))

// Compute the Merkle Root in Hexadecimal
const root = merkleTree.getHexRoot();
let provider = ethers.getDefaultProvider(parameters.mumbaiProvaider);
const signer = new ethers.Wallet(parameters.ownerPrivateKey, provider);
async function startDrop() {
    const contractAddress = parameters.contractAddress;
    const nagaNFT_Contract = new ethers.Contract(contractAddress, ABI, signer);
    try {
        const tx = await nagaNFT_Contract.startPreMint(true, root);
        console.log("Transaction is success \n" + tx.hash)
    } catch (e) {
        console.log(e)
    }
}

startDrop()