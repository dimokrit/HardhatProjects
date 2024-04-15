const shell = require("shelljs")
const schedule = require('node-schedule');
const owners = require('./data/myNftOwners.json')
const organicOwners = require('./data/organicNftOwners.json')
const { createListing } = require('./src/createListing.js')
const { buyListedItem } = require('./dist/buyListedItem.js')
const { createOffer } = require('./src/createOffer.js')
const { updateOrganicOwners } = require('./dist/updateOrganicOwners.js')
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
    default:
      console.log('INVALID EVENT NAME')
      break;
  }
}

async function createTrade() {
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

    const price = 0.1//Math.floor(randomNumber(minPrice, maxPrice + 1))

    console.log(`Listing #${i + 1} planned on ${nextListingDate} by ${nextListingAddress}`)
    let listingData
    let hash
    let protocolAddress
    const listingJob = schedule.scheduleJob(nextListingDate, async () => {
      console.log("__________________________________________________________________")
      console.log(`Listing new item from address: ${nextListingAddress} tokenId: ${tokenId} price: ${price} ...`);
      listingData = await createListing(nextListingAddress, tokenId, price, ownerId)
      hash = listingData.hash
      protocolAddress = listingData.protocolAddress
    })

    const nextBuyingPeriod = Math.floor(randomNumber(60 * 1000, eventEndTime - lastDate))
    const nextBuyingDate = new Date(lastDate + nextBuyingPeriod)

    let nextBuyingAddress
    storingNFT = 2
    while (storingNFT > 1 || buyingAddresses.includes(nextBuyingAddress) || nextBuyingAddress == nextListingAddress) {
      index = Math.floor(randomNumber(0, owners.length))
      nextBuyingAddress = owners[index]["address"]
      storingNFT = owners[index]["storingNFT"]["amount"]
    }
    buyingAddresses.push(nextBuyingAddress)
    const fulfillerId = index
    console.log(`Buying #${i + 1} planned on ${nextBuyingDate} by ${nextBuyingAddress}`)
    const buyingJob = schedule.scheduleJob(nextBuyingDate, async () => {
      console.log("__________________________________________________________________")
      console.log(`Buying item by address: ${nextBuyingAddress} tokenId: ${tokenId} with order hash: ${hash} ...`);
      await buyListedItem(hash, nextBuyingAddress, protocolAddress, ownerId, fulfillerId, tokenId)
    })
  }
}

async function listItems() {
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

    const price = 0.1//Math.floor(randomNumber(minPrice, maxPrice + 1))

    console.log(`Listing #${i + 1} planned on ${nextListingDate} by ${nextListingAddress}`)
    const listingJob = schedule.scheduleJob(nextListingDate, async () => {
      console.log("__________________________________________________________________")
      console.log(`Listing new item from address: ${nextListingAddress} tokenId: ${tokenId} price: ${price} ...`);
      await createListing(nextListingAddress, tokenId, price, ownerId)
    })
  }
}

async function createBestOffers() {
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
        console.log("__________________________________________________________________")
        console.log(`Making offer from address: ${nextOfferingAddress} tokenId: ${tokenId} price: ${price} ...`);
        await createOffer(nextOfferingAddress, tokenId, price)
      })
    
  }
}


function randomNumber(min, max) {
  return Math.random() * (max - min) + min
}

main()