const { MerkleTree } = require("merkletreejs");
const ethers = require("ethers");
const fs = require('fs')

let whitelist = fs.readFileSync("./parameters/whitelist.txt", 'utf-8').toString().replace('\r', '').split("\n");
const abiCoder = ethers.AbiCoder.defaultAbiCoder();

function encodeLeaf(address) {
  return abiCoder.encode(
    ["address"],
    [address]
  );
};

let list = []
for (let i = 0; i < whitelist.length; i++)
  list.push(encodeLeaf(whitelist[i].replace('\r', '')))

const merkleTree = new MerkleTree(list, ethers.keccak256, {
  hashLeaves: true,
  sortPairs: true,
  sortLeaves: true,
});
let leafs = []
// address - адрес кошелька с которого происходит минт. Должен меняться каждый раз, когда происходит минт, и каждый раз из него генерировать новую переменную proof
for (let i = 0; i < whitelist.length; i++) {
  const address = whitelist[i].replace('\r', '')// можно получать через ethers или web3, смотря через что запускаете
  const leaf = ethers.keccak256(encodeLeaf(address));
  const proof = merkleTree.getHexProof(leaf)
  leafs.push(proof);
}
fs.writeFile("./parameters/proofsCom.json", JSON.stringify(leafs).replace(/['"]+/g, ""), function (err) {
  if (err) {
    console.log(err);
  }
});
fs.writeFile("./parameters/proofs.json", JSON.stringify(leafs), function (err) {
  if (err) {
    console.log(err);
  }
});
// proof - пременная, которую нужно передать в функцию
//const proof = merkleTree.getHexProof(leaf)
console.log(leafs.length);