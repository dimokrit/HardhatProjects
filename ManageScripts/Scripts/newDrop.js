const { ethers, keccak256 } = require('ethers');
const { MerkleTree } = require("merkletreejs");
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
    encodeLeaf("0x0000000000000000000000000000000000000000"),
];

const merkleTree = new MerkleTree(list, keccak256, {
    hashLeaves: true,
    sortPairs: true,
    sortLeaves: true,
});

// Compute the Merkle Root in Hexadecimal
const root = merkleTree.getHexRoot();

let provider = ethers.getDefaultProvider(parameters.mumbaiProvaider);
const signer = new ethers.Wallet(parameters.ownerPrivateKey, provider);
async function newDrop() {
    const contractAddress = parameters.contractAddress;
    const nagaNFT_Contract = new ethers.Contract(contractAddress, ABI, signer);
    const preMintMaxSupply = 100;
    const maxSupply = 1000;
    const timeMintAfterPreMint = 120;
    try {
        const tx = await nagaNFT_Contract.setNewDrop(preMintMaxSupply, maxSupply, timeMintAfterPreMint, root)
        console.log("Transaction is success \n" + tx.hash)
    } catch (e) {
        console.log(e)
    }
}

newDrop()