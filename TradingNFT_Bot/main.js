const schedule = require('node-schedule');
const { ethers, getDefaultProvider, AlchemyProvider } = require('ethers')
const owners = require('./data/myNftOwners.json')
const nfts = require('./data/nfts.json')
const organicOwners = require('./data/organicNftOwners.json')
const walletsWithKey = require('./data/walletsWithKey.json')
const encryptedWallets = require('./data/encryptedWallets.json')
const { createListing } = require('./dist/createListing.js')
const { buyListedItem } = require('./dist/buyListedItem.js')
const { createOffer } = require('./dist/createOffer.js')
const { updateOrganicOwners } = require('./dist/updateOrganicOwners.js')
const { encryptWallets } = require('./dist/encryptWallet.js')
const { mint } = require('./dist/mintNFT.js')
const { distribution } = require('./dist/distribution.js')
const { myNftOwnersUpdate } = require('./dist/myNftOwnersUpdate.js')
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()

const provider = new AlchemyProvider('matic', process.env.ALCHEMY_API_KEY)

async function main() {
  const event = process.argv[2]

  switch (event) {
    case 'CreateTrade':
      createTrade()
      break;
    case 'ListItems':
      listItems()
      break;
    case 'CreateOffers':
      createBestOffers()
      break;
    case 'Encrypt':
      encrypt()
      break;
    case 'Distribution':
      distribute()
      break;
    case 'Mint':
      mintNFT()
      break;
      case 'GetBalances':
        getBalances()
        break;
        case 'UpdateMyNftOwners':
          myNftOwnersUpdate(provider)
          break;
    default:
      console.log('INVALID EVENT NAME')
      break;
      
  }
}

async function createTrade() {
  try {
    const amount = Number(process.argv[3])
    const period = Number(process.argv[4]) * 60
    const minPrice = Number(process.argv[5])
    const maxPrice = Number(process.argv[6])
    const maxItemPeriod = Number(period / amount)
    let lastDate = Date.now()
    const eventEndTime = lastDate + period * 1000
    let listingAddresses = []
    let buyingAddresses = []
    let listedIds = []
    let amountOfListed = {}
    for (let i = 0; i < amount; i++) {
      const newListingPeriod = Math.floor(randomNumber(60, maxItemPeriod))
      lastDate = lastDate + newListingPeriod * 1000
      const nextListingDate = new Date(lastDate)
      const storingOwners = owners["storing"]
      let storingNFT = 0
      let nextListingAddress
      let index

      do {
        index = Math.floor(randomNumber(0, storingOwners.length))
        nextListingAddress = storingOwners[index]["address"]
        storingNFT = storingOwners[index]["storingNFT"]["amount"]
      }
      while (storingNFT <= amountOfListed[nextListingAddress])

      if (amountOfListed[nextListingAddress])
        amountOfListed[nextListingAddress]++
      else amountOfListed[nextListingAddress] = 1

      const ownerId = index
      const tokenIds = storingOwners[index]["storingNFT"]["tokenIds"]
      let tokenId
      index = 0
      do {
        tokenId = tokenIds[index]
        index++
      }
      while (listedIds.includes(tokenId))
        console.log(tokenId)
      listedIds.push(tokenId)

      const price = Math.floor(randomNumber(minPrice, maxPrice + 1))

      console.log(`Listing #${i + 1} planned on ${nextListingDate} by ${nextListingAddress}`)
      let listingData
      let hash
      let protocolAddress

      const listingJob = schedule.scheduleJob(nextListingDate, async () => {
        try {
          console.log("__________________________________________________________________")
          console.log(`Listing new item from address: ${nextListingAddress} tokenId: ${tokenId} price: ${price} ...`);
          listingData = await createListing(nextListingAddress, tokenId, price, ownerId, provider)
          hash = listingData.hash
          protocolAddress = listingData.protocolAddress
        } catch (err) {

        }
      })

      const nextBuyingPeriod = Math.floor(randomNumber(60 * 1000, eventEndTime - lastDate))
      const nextBuyingDate = new Date(lastDate + nextBuyingPeriod)
      const nftPath = nfts[tokenId].path
      const ownersEmpty = owners["empty"]
      let nextBuyingAddress
      let balance
      do {
        index = Math.floor(randomNumber(0, ownersEmpty.length))
        nextBuyingAddress = ownersEmpty[index]["address"]
        balance = Number(ethers.formatEther(await provider.getBalance(nextBuyingAddress)))
      }
      while (nftPath.includes(nextBuyingAddress) && balance < price + 1)
      console.log("Balance: ", balance)
      const fulfillerId = index
      console.log(`Buying #${i + 1} planned on ${nextBuyingDate} by ${nextBuyingAddress}`)
      const buyingJob = schedule.scheduleJob(nextBuyingDate, async () => {
        try {
          if (hash) {
            console.log("__________________________________________________________________")
            console.log("fulfillerId ", fulfillerId)
            console.log(`Buying item by address: ${nextBuyingAddress} tokenId: ${tokenId} with order hash: ${hash} ...`);
            await buyListedItem(hash, nextBuyingAddress, protocolAddress, ownerId, fulfillerId, tokenId, provider)
          } else {
            console.log("HASH IS undefined")
          }
        } catch (err) { }
      })
    }
  } catch (err) { console.log(`createTrade error: ${err}`) }
}

async function listItems() {
  try {
    const amount = Number(process.argv[3])
    const period = Number(process.argv[4]) * 60
    const minPrice = Number(process.argv[5])
    const maxPrice = Number(process.argv[6])
    const maxItemPeriod = Number(period / amount)
    let lastDate = Date.now()
    const eventEndTime = lastDate + period * 1000
    let listingAddresses = []
    let buyingAddresses = []
    for (let i = 0; i < amount; i++) {
      const newListingPeriod = Math.floor(randomNumber(0, maxItemPeriod))
      lastDate = lastDate + newListingPeriod * 1000
      const nextListingDate = new Date(lastDate)

      let storingNFT = 0
      let nextListingAddress
      let index
      while (storingNFT == 0 || listingAddresses.includes(nextListingAddress)) {
        index = Math.floor(randomNumber(0, owners.length))
        nextListingAddress = owners[index]["address"]
        storingNFT = owners[index]["storingNFT"]["amount"]
      }
      const ownerId = index
      const tokenIds = owners[index]["storingNFT"]["tokenIds"]
      const tokenId = tokenIds[Math.floor(randomNumber(0, tokenIds.length))]
      listingAddresses.push(nextListingAddress)

      const price = Math.floor(randomNumber(minPrice, maxPrice + 1))

      console.log(`Listing #${i + 1} planned on ${nextListingDate} by ${nextListingAddress}`)
      const listingJob = schedule.scheduleJob(nextListingDate, async () => {
        try {
          console.log("__________________________________________________________________")
          console.log(`Listing new item from address: ${nextListingAddress} tokenId: ${tokenId} price: ${price} ...`);
          await createListing(nextListingAddress, tokenId, price, ownerId, provider)
        } catch (err) { }
      })
    }
  } catch (err) { console.log(`listItems error: ${err}`) }
}

async function createBestOffers() {
  try {
    const maxAmount = await updateOrganicOwners()
    const amount = process.argv[3] == 'all' ? maxAmount : process.argv[3]
    const period = Number(process.argv[4]) * 60
    const minPrice = Number(process.argv[5])
    const maxPrice = Number(process.argv[6])
    const maxItemPeriod = Number(period / amount)
    let lastDate = Date.now()
    const eventEndTime = lastDate + period * 1000
    let offeredAddresses = []
    let buyingAddresses = []
    for (let i = 0; i < amount; i++) {
      const newListingPeriod = Math.floor(randomNumber(0, maxItemPeriod))
      lastDate = lastDate + newListingPeriod * 1000
      const nextListingDate = new Date(lastDate)

      let storingNFT = 0
      let nextOfferingAddress
      let index
      do {
        index = Math.floor(randomNumber(0, owners.length))
        nextOfferingAddress = owners[index]['address']
        storingNFT = owners[index]['storingNFT']['amount']
      } while (storingNFT > 1 || offeredAddresses.includes(nextOfferingAddress))
      offeredAddresses.push(nextOfferingAddress)
      index = Math.floor(randomNumber(0, organicOwners.length))
      const tokenId = organicOwners[index]['tokenId']
      const price = Math.floor(randomNumber(minPrice, maxPrice + 1))

      console.log(`Make offer #${i + 1} planned on ${nextListingDate} by ${nextOfferingAddress}`)
      console.log(nextOfferingAddress)
      const offeringJob = schedule.scheduleJob(nextListingDate, async () => {
        try {
          console.log("__________________________________________________________________")
          console.log(`Making offer from address: ${nextOfferingAddress} tokenId: ${tokenId} price: ${price} ...`);
          await createOffer(nextOfferingAddress, tokenId, price, provider)
        } catch (err) { }
      })
    }
  } catch (err) { console.log(`createBestOffers error: ${err}`) }
}

async function encrypt() {
  try {
    await encryptWallets()
    console.log("__________________________________________________________________")
    console.log("Wallets successfully encrypted to encryptedWallets.json")
  } catch (err) {
    console.log(err)
  }
}

async function distribute() {
  try {
    const q = process.argv[3]
    const amount = ethers.parseEther(process.argv[4])
    console.log(amount)
    await distribution(q, amount, provider)
    console.log("__________________________________________________________________")
    console.log("Matic was successfully disributed")
  } catch (err) {
    console.log(err)
  }
}

async function mintNFT() {
  try {
    const amount = process.argv[3] == 'all' ? walletsWithKey.length : process.argv[3]
    const period = Number(process.argv[4]) * 60
    const maxItemPeriod = Number(period / amount)
    let lastDate = Date.now()
    for (let i = 0; i < amount; i++) {
      const newMintingPeriod = Math.floor(randomNumber(60, maxItemPeriod))
      lastDate = lastDate + newMintingPeriod * 1000
      const nextMintingDate = new Date(lastDate)
      const tokenId = i
      const minter = walletsWithKey[i]['address']
      console.log(`Mint #${i + 1} planned on ${nextMintingDate} by ${minter}`)
      const mintingJob = schedule.scheduleJob(nextMintingDate, async () => {
        try {
          console.log("__________________________________________________________________")
          console.log(`Minting from address: ${minter} tokenId: ${tokenId} ...`);
          await mint(minter, tokenId, provider)
        } catch (err) { }
      })
    }
  } catch (err) { console.log(`createBestOffers error: ${err}`) }
}


function randomNumber(min, max) {
  return Math.random() * (max - min) + min
}

async function getBalances() {
  let n = 1
  for (const [key, value] of Object.entries(encryptedWallets)) {
    const balance = ethers.formatEther(await provider.getBalance(key))
    console.log(`#${n}  ${key}: Balance is ${balance} MATIC`)
    n++
  }
}


async function updateOwners() {
  const allOwners = owners["storing"] + owners["empty"]
  for (let i=0; i < owners["storing"].length; i++) {
    if (owners["storing"][i]["storingNFT"]["amount"] < 1) {
      owners["empty"].push(owners["storing"][i])
      owners["storing"].splice(i, 1)
    }
  }

  for (let i=0; i < owners["empty"].length; i++) {
    if (owners["empty"][i]["storingNFT"]["amount"] > 0) {
      owners["storing"].push(owners["empty"][i])
      owners["empty"].splice(i, 1)
    }
  }

}

main()