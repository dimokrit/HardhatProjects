const hre = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const dotenv = require('dotenv')
dotenv.config()
var fs = require('fs');

async function main() {
  const provider = new hre.ethers.JsonRpcProvider(process.env.POLYGON_INFURA_KEY)//process.env.POLYGON_INFURA_KEY for PROD
  const signer = new hre.ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider)
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

  // Constructor Parameters
  const uri = "https://purple-tiny-earthworm-73.mypinata.cloud/ipfs/QmREqqrZoZShTuXBYW92UrUx9JiBayC9Hx8YZ4VLQx1fmM/"
  const name = "Girand Hero “Medusa”"
  const symbol = "GHM"
  const royalty = 300
  const royaltyAddress = "0x2053F8A250A84552831E433F03F324003A5F3964"
  const root = merkleTree.getHexRoot();

  const Girand_Hero_Medusa = await hre.ethers.deployContract("Girand_Hero_Medusa", [uri, name, symbol, royalty, royaltyAddress, root], signer)
    .then(function (res, err) {
      if (err)
        console.log(err);
      console.log(`Contract deployed at ${res["target"]}`);
    })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
