const schedule = require('node-schedule')
const { ethers, getDefaultProvider, AlchemyProvider } = require('ethers')
const { createListing } = require('./scripts/createListing.js')
const { buyListedItem } = require('./scripts/buyListedItem.js')
const { createOffer } = require('./scripts/createOffer.js')
const { updateOrganicOwners } = require('./scripts/updateOrganicOwners.js')
const { encryptWallets } = require('./scripts/encryptWallet.js')
const { mint } = require('./scripts/mintNFT.js')
const { distribution } = require('./scripts/distribution.js')
const { updateNftData } = require('./scripts/updateNftData.js')
const { buyOneItem } = require('./scripts/buyOneItem.js')
const { pool } = require('./db/postgresModel.js')
const dotenv = require('dotenv')
dotenv.config()

const yellow = '\x1b[33m%s\x1b[0m'
const blue = '\x1b[34m%s\x1b[0m'
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
    case 'BuyOneItem':
      buyOneItem()
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
    case 'UpdateData':
      updateData()
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
    let listingData = {}

    const owners = (await pool.query(`SELECT address, nftAmount, nftIds FROM mywallets WHERE nftAmount > 0`)).rows
    const buyers = (await pool.query(`SELECT address FROM mywallets WHERE used = TRUE`)).rows

    for (let i = 0; i < amount; i++) {
      const newListingPeriod = Math.floor(randomNumber(60, maxItemPeriod))
      lastDate = lastDate + newListingPeriod * 1000
      const nextListingDate = new Date(lastDate)
      let nextListingAddress
      let nextListingId = 0
      let index

      while (true) {
        index = Math.floor(randomNumber(0, owners.length))
        nextListingAddress = owners[index]['address']
        if (!listingData[nextListingAddress]) {
          listingData[nextListingAddress] = { 'amount': 1 }
          break
        } if (listingData[nextListingAddress]['amount'] < owners[index]['amount']) {
          listingData[nextListingAddress]['amount']++
          break
        }
      }

      let nftIndex = 0
      while (true) {
        console.log(owners[index]['nftids'])
        nextListingId = owners[index]['nftids'][nftIndex]

        if (!listingData[nextListingAddress]['ids']) {
          listingData[nextListingAddress] = { 'ids': [nextListingId] }
          break
        }
        if (!listingData[nextListingAddress]['ids'].includes(nextListingId)) {
          listingData[nextListingAddress]['ids'].push(nextListingId)
          break
        }
        nftIndex++
      }

      const price = Math.floor(randomNumber(minPrice, maxPrice + 1))

      console.log(blue, `#${i + 1} Listing NFT with id ${nextListingId} planned on ${nextListingDate} by ${nextListingAddress} with price ${price}`)

      let listedData
      let hash
      let protocolAddress

      const listingJob = schedule.scheduleJob(nextListingDate, async () => {
        try {
          console.log(yellow, "_____________________________________________________________________________________________")
          console.log(yellow, `Listing NFT #${nextListingId} from ${nextListingAddress} with price ${price} ...`);
          listedData = await createListing(nextListingAddress, nextListingId, price, provider)
          hash = listedData.hash
          protocolAddress = listedData.protocolAddress
        } catch (err) { }
      })

      const nextBuyingPeriod = Math.floor(randomNumber(60 * 1000, eventEndTime - lastDate))
      const nextBuyingDate = new Date(lastDate + nextBuyingPeriod)
      let nextBuyingAddress

      while (true) {
        index = Math.floor(randomNumber(0, buyers.length))
        nextBuyingAddress = buyers[index]['address']
        const path = (await pool.query(`SELECT path FROM nfts WHERE nftId = ${nextListingId}`)).rows[0]['path']
        const balance = Number(ethers.formatEther(await provider.getBalance(nextBuyingAddress)))
        if (!path.includes(nextBuyingAddress) && balance >= price + 0.5) break
      }
      console.log(blue, `#${i + 1} Buying NFT with id ${nextListingId} planned on ${nextBuyingDate} by ${nextBuyingAddress}`)

      const buyingJob = schedule.scheduleJob(nextBuyingDate, async () => {
        try {
          if (hash) {
            console.log(yellow, "_____________________________________________________________________________________________")
            console.log(yellow, `Buying NFT #${nextListingId} by ${nextBuyingAddress} with order hash: ${hash} ...`);
            await buyListedItem(hash, nextBuyingAddress, nextListingAddress, nextListingId, protocolAddress, provider)
          } else
            console.log("HASH IS UNDEFINED")
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
    let listingData = {}

    const owners = (await pool.query(`SELECT address, nftAmount, nftIds FROM mywallets WHERE nftAmount > 0`)).rows
    const buyers = (await pool.query(`SELECT address FROM mywallets WHERE used = TRUE`)).rows

    for (let i = 0; i < amount; i++) {
      const newListingPeriod = Math.floor(randomNumber(60, maxItemPeriod))
      lastDate = lastDate + newListingPeriod * 1000
      const nextListingDate = new Date(lastDate)
      let nextListingAddress
      let nextListingId = 0
      let index

      while (true) {
        index = Math.floor(randomNumber(0, owners.length))
        nextListingAddress = owners[index]['address']
        if (!listingData[nextListingAddress]) {
          listingData[nextListingAddress] = { 'amount': 1 }
          break
        } if (listingData[nextListingAddress]['amount'] < owners[index]['amount']) {
          listingData[nextListingAddress]['amount']++
          break
        }
      }

      let nftIndex = 0
      while (true) {
        console.log(owners[index]['nftids'])
        nextListingId = owners[index]['nftids'][nftIndex]

        if (!listingData[nextListingAddress]['ids']) {
          listingData[nextListingAddress] = { 'ids': [nextListingId] }
          break
        }
        if (!listingData[nextListingAddress]['ids'].includes(nextListingId)) {
          listingData[nextListingAddress]['ids'].push(nextListingId)
          break
        }
        nftIndex++
      }

      const price = Math.floor(randomNumber(minPrice, maxPrice + 1))

      console.log(blue, `#${i + 1} Listing NFT with id ${nextListingId} planned on ${nextListingDate} by ${nextListingAddress} with price ${price}`)

      let listedData
      let hash
      let protocolAddress

      const listingJob = schedule.scheduleJob(nextListingDate, async () => {
        try {
          console.log(yellow, "_____________________________________________________________________________________________")
          console.log(yellow, `Listing NFT #${nextListingId} from ${nextListingAddress} with price ${price} ...`);
          listedData = await createListing(nextListingAddress, nextListingId, price, provider)
          hash = listedData.hash
          protocolAddress = listedData.protocolAddress
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

async function updateData() {
  const usingWalletsCount = Number(process.argv[3])
  await updateNftData(usingWalletsCount, provider)
  console.log('NFT and wallets data was successfully updated')
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
  for (let i = 0; i < owners["storing"].length; i++) {
    if (owners["storing"][i]["storingNFT"]["amount"] < 1) {
      owners["empty"].push(owners["storing"][i])
      owners["storing"].splice(i, 1)
    }
  }

  for (let i = 0; i < owners["empty"].length; i++) {
    if (owners["empty"][i]["storingNFT"]["amount"] > 0) {
      owners["storing"].push(owners["empty"][i])
      owners["empty"].splice(i, 1)
    }
  }

}

main()