
const { expect } = require("chai");
const { Wallet } = require("ethers");
const { ethers } = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs")

list = []
let merkleTree;

function encodeLeaf(address) {
  return ethers.utils.defaultAbiCoder.encode(
    ["address"], [address]
  )
}

describe("Girant_Amulet_Hasture_Test", function () {
  let wallets = [11]
  let _Girand_Hero_Medusa
  beforeEach(async function () {
    wallets = await ethers.getSigners();

    list = [
      encodeLeaf(wallets[0].address),
      encodeLeaf(wallets[1].address),
      encodeLeaf(wallets[2].address),
      encodeLeaf(wallets[3].address)
    ];

    merkleTree = new MerkleTree(list, keccak256, {
      hashLeaves: true,
      sortPairs: true,
      sortLeaves: true,
    });

    const Girand_Hero_Medusa = await ethers.getContractFactory("Girand_Amulet", wallets[0]);

    _Girand_Hero_Medusa = await Girand_Hero_Medusa.deploy("-", "Girand_Amulet", "GA", 500)

    await _Girand_Hero_Medusa.deployed()
  })

  it("it should be deployed", async function () {
    expect(_Girand_Hero_Medusa.address).to.be.properAddress;
  })

  it("it should return Not Started error", async function () {
    const leaf = keccak256(wallets[0].address)
    const proof = merkleTree.getHexProof(leaf)
    expect(_Girand_Hero_Medusa.connect(wallets[0]).publicMint(1)).to.be.revertedWith("Public sale has not started yet")
    expect(_Girand_Hero_Medusa.connect(wallets[0]).presaleMint(1, proof)).to.be.revertedWith("Presale has not started yet")
  })

  it("it should be sale minted by whitelist", async function () {
    await _Girand_Hero_Medusa.connect(wallets[0]).togglePresaleStarted()
    await _Girand_Hero_Medusa.connect(wallets[0]).setPrices(10, 10)
    await _Girand_Hero_Medusa.connect(wallets[0]).setNFTLimits(1, 1)

    const root = merkleTree.getHexRoot();
    await _Girand_Hero_Medusa.connect(wallets[0]).setmerkleRoot(root)
    for (let i = 0; i < 3; i++) {
      const leaf = keccak256(list[i])
      const proof = merkleTree.getHexProof(leaf)
      let mint = await _Girand_Hero_Medusa.connect(wallets[i]).presaleMint(1, proof, { value: "10" })
      await mint.wait()
    }

    let leaf = keccak256(encodeLeaf(wallets[4].address))
    let proof = merkleTree.getHexProof(leaf)
    expect(_Girand_Hero_Medusa.connect(wallets[4]).presaleMint(1, proof, { value: "10" })).to.be.revertedWith("Presale must be minted from our website", "exp #2")

    leaf = keccak256(encodeLeaf(wallets[0].address))
    proof = merkleTree.getHexProof(leaf)
    expect(_Girand_Hero_Medusa.connect(wallets[0]).presaleMint(1, proof, { value: "10" })).to.be.revertedWith("Minting would exceed wallet limit", "exp #2")

    leaf = keccak256(encodeLeaf(wallets[3].address))
    proof = merkleTree.getHexProof(leaf)
    expect(_Girand_Hero_Medusa.connect(wallets[3]).presaleMint(1, proof, { value: "9" })).to.be.revertedWith("Fund amount is incorrect", "exp #2")

    let totalSupply = await _Girand_Hero_Medusa.totalSupply()
    expect(totalSupply).to.equal(3, "exp #3")
  })

  it("it should be sale minted", async function () {
    await _Girand_Hero_Medusa.connect(wallets[0]).togglePublicSaleStarted()
    await _Girand_Hero_Medusa.connect(wallets[0]).setPrices(10, 10)
    await _Girand_Hero_Medusa.connect(wallets[0]).setNFTLimits(1, 1)

    for (let i = 0; i < 10; i++) {
      let mint = await _Girand_Hero_Medusa.connect(wallets[i]).publicMint(1, { value: "10" })
      await mint.wait()
    }

    expect(_Girand_Hero_Medusa.connect(wallets[0]).publicMint(1, { value: "10" })).to.be.revertedWith("Minting would exceed wallet limit", "exp #2")

    expect(_Girand_Hero_Medusa.connect(wallets[10]).publicMint(1, { value: "9" })).to.be.revertedWith("Fund amount is incorrect", "exp #2")

    let totalSupply = await _Girand_Hero_Medusa.totalSupply()
    expect(totalSupply).to.equal(10, "exp #3")
  })

  it("it should be updated", async function () {
    expect(await _Girand_Hero_Medusa.owner()).to.eql(wallets[0].address, "exp #1")
    await _Girand_Hero_Medusa.connect(wallets[0]).transferOwnership(wallets[1].address)
    expect(await _Girand_Hero_Medusa.owner()).to.eql(wallets[1].address, "exp #2" + wallets[0].address + "   " + wallets[1].address)
  })
})
