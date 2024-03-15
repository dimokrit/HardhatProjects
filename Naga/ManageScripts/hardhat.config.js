require("@nomicfoundation/hardhat-toolbox");
const dotenv = require('dotenv')
dotenv.config()

const DEFAULT_COMPILER_SETTINGS = {
  version: '0.8.23',
  settings: {
    evmVersion: 'shanghai',
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [DEFAULT_COMPILER_SETTINGS],
  },
  networks: {
    polygon: {
      url: process.env.POLYGON_INFURA_KEY,
      accounts: [process.env.OWNER_PRIVATE_KEY],
    },
    mumbai: {
      url: process.env.MUMBAI_INFURA_KEY,
      accounts: [process.env.OWNER_PRIVATE_KEY],
    },

  },
};
