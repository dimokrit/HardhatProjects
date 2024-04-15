"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sdk = exports.WALLET_ADDRESS = exports.walletMainnet = exports.ALCHEMY_API_KEY_MAINNET = exports.WALLET_PRIV_KEY = exports.OPENSEA_API_KEY = void 0;
const opensea_js_1 = require("opensea-js");
const ethers_1 = require("ethers");
exports.OPENSEA_API_KEY = "f45a6d8840e543e382dba2c25e0069b3";
exports.WALLET_PRIV_KEY = "8dcd5b5d790d5444e34737302d698b2d392609a67cd5ba81656470db9dce72c8";
exports.ALCHEMY_API_KEY_MAINNET = "w7I9IAxAroXbPjGTtAFqN8IlptmpoEK7";
let provider = new ethers_1.AlchemyProvider("matic", exports.ALCHEMY_API_KEY_MAINNET);
exports.walletMainnet = new ethers_1.ethers.Wallet(exports.WALLET_PRIV_KEY, provider);
exports.WALLET_ADDRESS = exports.walletMainnet.address;
exports.sdk = new opensea_js_1.OpenSeaSDK(exports.walletMainnet, {
    chain: opensea_js_1.Chain.Polygon,
    apiKey: exports.OPENSEA_API_KEY,
}, (line) => console.info(`MAINNET: ${line}`));
