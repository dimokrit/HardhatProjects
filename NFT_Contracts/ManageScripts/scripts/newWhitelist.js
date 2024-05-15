const { MerkleTree } = require("merkletreejs");
const { abi } = require("../artifacts/contracts/Girant_Hero_Medusa.sol/Girand_Hero_Medusa.json")
const hre = require("hardhat");
const dotenv = require('dotenv')
const fs = require('fs')

dotenv.config()

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
  list.push(encodeLeaf(whitelist[i]))

const merkleTree = new MerkleTree(list, hre.ethers.keccak256, {
  hashLeaves: true,
  sortPairs: true,
  sortLeaves: true,
});

// Compute the Merkle Root in Hexadecimal
const root = merkleTree.getHexRoot();
console.log(root)
// Get proof for mint function
// const leaf = hre.ethers.keccak256(encodeLeaf("0x046AAB6615c7F91C0bef758C506316aF94f4B0D2")); // The hash of the node
// const proof = merkleTree.getHexProof(leaf)
// console.log(proof)

const provider = new hre.ethers.JsonRpcProvider(process.env.MUMBAI_INFURA_KEY)
const signer = new hre.ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider)

async function newMerkle() {
    const nagaNFT_Contract = new hre.ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);
    try {
        const tx = await nagaNFT_Contract.setNewMerkleRoot(root)
        console.log("Transaction is success \n" + tx.hash)
    } catch (e) {
        console.log(e)
    }
}

//newMerkle()