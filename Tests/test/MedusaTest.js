const { expect } = require("chai");
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

describe("Girant_Hero_Medusa_Test", function () {
  let wallets = [10]
  let _Girand_Hero_Medusa
  beforeEach(async function () {
    wallets = await ethers.getSigners();

    list = [
      encodeLeaf(wallets[0].address),
      encodeLeaf(wallets[1].address),
      encodeLeaf(wallets[2].address)
    ];

    merkleTree = new MerkleTree(list, keccak256, {
      hashLeaves: true,
      sortPairs: true,
      sortLeaves: true,
    });

    const root = merkleTree.getHexRoot();

    const Girand_Hero_Medusa = await ethers.getContractFactory("Girand_Hero_Medusa", wallets[0]);

    _Girand_Hero_Medusa = await Girand_Hero_Medusa.deploy("-", "Girand_Hero_Medusa", "GHM", 500, root)

    await _Girand_Hero_Medusa.deployed()
  })

  it("it should be deployed", async function () {
    expect(_Girand_Hero_Medusa.address).to.be.properAddress;
  })

  it("it should return Not Started error", async function () {
    const leaf = keccak256(wallets[0].address)
    const proof = merkleTree.getHexProof(leaf)
    expect(_Girand_Hero_Medusa.connect(wallets[0]).freeMint(proof)).to.be.revertedWith("Minting event has not started yet")
  })

  it("it should be minted by whitelist", async function () {
    await _Girand_Hero_Medusa.connect(wallets[0]).startPreMint()
    await _Girand_Hero_Medusa.getDropData(1).then(function (res) {
      expect(res["preMintStarted"]).to.eql(true, "exp #1")
    })

    for (let i = 0; i < 3; i++) {
      const leaf = keccak256(list[i])
      const proof = merkleTree.getHexProof(leaf)
      let mint = await _Girand_Hero_Medusa.connect(wallets[i]).freeMint(proof)
      await mint.wait()
    }

    let leaf = keccak256(list[0])
    let proof = merkleTree.getHexProof(leaf)
    expect(_Girand_Hero_Medusa.connect(wallets[0]).freeMint(proof)).to.be.revertedWith("Minting would exceed wallet limit", "exp #2")

    let totalSupply = await _Girand_Hero_Medusa.totalSupply()
    expect(totalSupply).to.equal(3, "exp #3")

    list = [
      encodeLeaf(wallets[3].address),
      encodeLeaf(wallets[4].address),
      encodeLeaf(wallets[5].address)
    ];

    merkleTree = new MerkleTree(list, keccak256, {
      hashLeaves: true,
      sortPairs: true,
      sortLeaves: true,
    });

    const root = merkleTree.getHexRoot();

    await _Girand_Hero_Medusa.connect(wallets[0]).setNewMerkleRoot(root)

    leaf = keccak256(encodeLeaf(wallets[3].address))
    proof = merkleTree.getHexProof(leaf)
    let mint = await _Girand_Hero_Medusa.connect(wallets[3]).freeMint(proof)
    await mint.wait()

    leaf = keccak256(encodeLeaf(wallets[4].address))
    proof = merkleTree.getHexProof(leaf)
    mint = await _Girand_Hero_Medusa.connect(wallets[4]).freeMint(proof)
    await mint.wait()

    leaf = keccak256(encodeLeaf(wallets[5].address))
    proof = merkleTree.getHexProof(leaf)
    expect(_Girand_Hero_Medusa.connect(wallets[5]).freeMint(proof)).to.be.revertedWith("Exceeded max premint NFTs amount", "exp #4")

    leaf = keccak256(encodeLeaf(wallets[6].address))
    proof = merkleTree.getHexProof(leaf)
    expect(_Girand_Hero_Medusa.connect(wallets[6]).freeMint(proof)).to.be.revertedWith("Your address is not in the whitelist", "exp #5")


  })

  it("it should be updated", async function () {
    expect(await _Girand_Hero_Medusa.owner()).to.eql(wallets[0].address, "exp #1")
    await _Girand_Hero_Medusa.connect(wallets[0]).transferOwnership(wallets[1].address)
    expect(await _Girand_Hero_Medusa.owner()).to.eql(wallets[1].address, "exp #2" + wallets[0].address + "   " + wallets[1].address)
  })
})
