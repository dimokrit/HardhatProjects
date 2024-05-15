const hre = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const dotenv = require('dotenv')
dotenv.config()
var fs = require('fs');

async function main() {
  const provider = new hre.ethers.JsonRpcProvider(process.env.POLYGON_INFURA_KEY)//process.env.POLYGON_INFURA_KEY for PROD
  const signer = new hre.ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider)
  // let whitelist = fs.readFileSync("./parameters/whitelist.txt", 'utf-8').toString().replace('\r', '').split("\n");
  // const abiCoder = hre.ethers.AbiCoder.defaultAbiCoder();

  // function encodeLeaf(address) {
  //   return abiCoder.encode(
  //     ["address"],
  //     [address]
  //   );
  // };

  // let list = []
  // for (let i = 0; i < whitelist.length; i++)
  //   list.push(encodeLeaf(whitelist[i].replace('\r', '')))

  // const merkleTree = new MerkleTree(list, hre.ethers.keccak256, {
  //   hashLeaves: true,
  //   sortPairs: true,
  //   sortLeaves: true,
  // });

  // Constructor Parameters
  const uri = "https://blue-immense-harrier-304.mypinata.cloud/ipfs/QmX5uQNTWAtTrwv31zQuq5Lmn5A6mEeH2BwHLpUmm6rTxF/"
  const name = "Colorful Sunsets"
  const symbol = "CS"
  const royalty = 0
  const royaltyAddress = "0x3DB4362D5FB7B56C79aC624f14B43389519c77bB"
  //const root = merkleTree.getHexRoot();

  const ColorfulSunsets = await hre.ethers.deployContract("ColorfulSunsets", [uri, name, symbol, royalty, royaltyAddress], signer)
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
