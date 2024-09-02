const { expect } = require("chai");

describe("Token", function () {
  let wallets = [10]
  let _Token
  let _Launchpad
  beforeEach(async function () {
    wallets = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token", wallets[0]);
    _Token = await Token.deploy("Name", "Sym")
    const Launchpad = await ethers.getContractFactory("Launchpad", wallets[0]);
    _Launchpad = await Launchpad.deploy(_Token.target)
  })

  it("it should be deployed", async function () {
    expect(_Token.target).to.be.properAddress;
    expect(_Launchpad.target).to.be.properAddress;
  })

  it("it should be minted", async function () {
    const amount = 1000
    await _Token.connect(wallets[0]).mint(amount)
    const mintedTokens = await _Token.totalTokens()
    expect(mintedTokens).to.equal(amount)
  })

  it("it should be airdroped", async function () {
    const amount = 1000
    await _Token.connect(wallets[0]).Airdrop(amount, wallets[1])
    const balance = await _Token.balanceOf(wallets[1])
    expect(balance).to.equal(amount)
  })

  it("it should be burned", async function () {
    const amount = 1000
    await _Token.connect(wallets[0]).mint(amount)
    const mintedTokens = await _Token.totalTokens()
    expect(mintedTokens).to.equal(amount)

    await _Token.connect(wallets[0]).burn(wallets[0], amount)
    const totalTokens = await _Token.totalTokens()
    expect(totalTokens).to.equal(0)
  })
})

describe("Launchpad Admin", function () {
  let wallets = [10]
  let _Token
  let _Launchpad
  beforeEach(async function () {
    wallets = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token", wallets[0]);
    _Token = await Token.deploy("Name", "Sym")

    const Launchpad = await ethers.getContractFactory("Launchpad", wallets[0]);
    _Launchpad = await Launchpad.deploy(_Token.target)

    const amount = 1000
    await _Token.connect(wallets[0]).Airdrop(amount, _Launchpad.target)
  })

  it("it should be deployed", async function () {
    expect(_Token.target).to.be.properAddress;
    expect(_Launchpad.target).to.be.properAddress;
  })

  it("set new stage", async function () {
    const balance = await _Token.balanceOf(_Launchpad.target)
    expect(balance).to.equal(1000)

    const whitelist = false
    const maxUsers = 100
    const totalTokenAmount = balance
    const percentTGE = 10
    const percentLinear = 10
    const startTime = 30
    const paymentPeriod = 15
    const lockUpPeriod = 100
    const merkleRoot = "0x0000000000000000000000000000000000000000000000000000000000000000"

    await _Launchpad.connect(wallets[0]).newStage(whitelist, maxUsers, totalTokenAmount, percentTGE, percentLinear, startTime, paymentPeriod, lockUpPeriod, merkleRoot)
    await _Launchpad.getStage(1).then((res, err) => {
      expect(res.whitelist).to.equal(whitelist)
      expect(res.maxUsers).to.equal(maxUsers)
      expect(res.totalTokenAmount).to.equal(totalTokenAmount)
      expect(res.percentTGE).to.equal(percentTGE)
      expect(res.percentLinear).to.equal(percentLinear)
      expect(res.startTime).to.equal(startTime)
      expect(res.paymentPeriod).to.equal(paymentPeriod)
      expect(res.lockUpPeriod).to.equal(lockUpPeriod)
      expect(res.merkleRoot).to.equal(merkleRoot)
    })
  })

  it("change blacklist", async function () {
    await _Launchpad.connect(wallets[0]).setBlacklist(wallets[2])
    const blacklisted = await _Launchpad.blacklisted(wallets[2])
    expect(blacklisted).to.equal(true)

    await _Launchpad.connect(wallets[0]).setBlacklist(wallets[2])
    const _blacklisted = await _Launchpad.blacklisted(wallets[2])
    expect(_blacklisted).to.equal(false)
  })

  it("admin can register user", async function () {
    const balance = await _Token.balanceOf(_Launchpad.target)
    expect(balance).to.equal(1000)

    const index = 1

    const whitelist = false
    const maxUsers = 100
    const totalTokenAmount = balance
    const percentTGE = 10
    const percentLinear = 10
    const startTime = 30
    const paymentPeriod = 15
    const lockUpPeriod = 100
    const merkleRoot = "0x0000000000000000000000000000000000000000000000000000000000000000"

    await _Launchpad.connect(wallets[0]).newStage(whitelist, maxUsers, totalTokenAmount, percentTGE, percentLinear, startTime, paymentPeriod, lockUpPeriod, merkleRoot)
    await _Launchpad.getStage(index).then((res, err) => {
      expect(res.whitelist).to.equal(whitelist)
      expect(res.maxUsers).to.equal(maxUsers)
      expect(res.totalTokenAmount).to.equal(totalTokenAmount)
      expect(res.percentTGE).to.equal(percentTGE)
      expect(res.percentLinear).to.equal(percentLinear)
      expect(res.startTime).to.equal(startTime)
      expect(res.paymentPeriod).to.equal(paymentPeriod)
      expect(res.lockUpPeriod).to.equal(lockUpPeriod)
      expect(res.merkleRoot).to.equal(merkleRoot)
    })

    await _Launchpad.connect(wallets[0]).toggleRegistrationState(index)
    await _Launchpad.connect(wallets[0]).adminRegistration(index, [wallets[1], wallets[2]])

    const registered = await _Launchpad.getUserIsRegistered(index, wallets[1])
    expect(registered).to.equal(true)

    const _registered = await _Launchpad.getUserIsRegistered(index, wallets[2])
    expect(registered).to.equal(true)
  })
})

describe("User basic", function () {
  let wallets = [10]
  let _Token
  let _Launchpad
  beforeEach(async function () {
    wallets = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token", wallets[0]);
    _Token = await Token.deploy("Name", "Sym")

    const Launchpad = await ethers.getContractFactory("Launchpad", wallets[0]);
    _Launchpad = await Launchpad.deploy(_Token.target)

    const amount = 1000
    await _Token.connect(wallets[0]).Airdrop(amount, _Launchpad.target)
  })

  it("user can register", async function () {
    const balance = await _Token.balanceOf(_Launchpad.target)
    expect(balance).to.equal(1000)

    const index = 1

    const whitelist = false
    const maxUsers = 100
    const totalTokenAmount = balance
    const percentTGE = 10
    const percentLinear = 10
    const startTime = 30
    const paymentPeriod = 15
    const lockUpPeriod = 100
    const merkleRoot = "0x0000000000000000000000000000000000000000000000000000000000000000"

    await _Launchpad.connect(wallets[0]).newStage(whitelist, maxUsers, totalTokenAmount, percentTGE, percentLinear, startTime, paymentPeriod, lockUpPeriod, merkleRoot)
    await _Launchpad.getStage(index).then((res, err) => {
      expect(res.whitelist).to.equal(whitelist)
      expect(res.maxUsers).to.equal(maxUsers)
      expect(res.totalTokenAmount).to.equal(totalTokenAmount)
      expect(res.percentTGE).to.equal(percentTGE)
      expect(res.percentLinear).to.equal(percentLinear)
      expect(res.startTime).to.equal(startTime)
      expect(res.paymentPeriod).to.equal(paymentPeriod)
      expect(res.lockUpPeriod).to.equal(lockUpPeriod)
      expect(res.merkleRoot).to.equal(merkleRoot)
    })

    await _Launchpad.connect(wallets[0]).toggleRegistrationState(index)
    await _Launchpad.connect(wallets[1]).stageRegistration(index)

    const registered = await _Launchpad.getUserIsRegistered(index, wallets[1])
    expect(registered).to.equal(true)
  })

  it("user can get first claim", async function () {
    const balance = await _Token.balanceOf(_Launchpad.target)
    expect(balance).to.equal(1000)

    const index = 1

    const whitelist = false
    const maxUsers = 100
    const totalTokenAmount = balance
    const percentTGE = 10
    const percentLinear = 10
    const startTime = 30
    const paymentPeriod = 15
    const lockUpPeriod = 0
    const merkleRoot = "0x0000000000000000000000000000000000000000000000000000000000000000"

    await _Launchpad.connect(wallets[0]).newStage(whitelist, maxUsers, totalTokenAmount, percentTGE, percentLinear, startTime, paymentPeriod, lockUpPeriod, merkleRoot)
    await _Launchpad.getStage(index).then((res, err) => {
      expect(res.whitelist).to.equal(whitelist)
      expect(res.maxUsers).to.equal(maxUsers)
      expect(res.totalTokenAmount).to.equal(totalTokenAmount)
      expect(res.percentTGE).to.equal(percentTGE)
      expect(res.percentLinear).to.equal(percentLinear)
      expect(res.startTime).to.equal(startTime)
      expect(res.paymentPeriod).to.equal(paymentPeriod)
      expect(res.lockUpPeriod).to.equal(lockUpPeriod)
      expect(res.merkleRoot).to.equal(merkleRoot)
    })

    await _Launchpad.connect(wallets[0]).toggleRegistrationState(index)
    await _Launchpad.connect(wallets[1]).stageRegistration(index)
    await _Launchpad.connect(wallets[2]).stageRegistration(index)

    const registered = await _Launchpad.getUserIsRegistered(index, wallets[1])
    expect(registered).to.equal(true)

    await _Launchpad.connect(wallets[0]).toggleStageState(index)
    await _Launchpad.connect(wallets[1]).claim(index);

    const userBalance = await _Token.balanceOf(wallets[0])
    expect(userBalance).to.equal(500)
  })

})
