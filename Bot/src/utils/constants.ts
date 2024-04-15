import { Chain, OpenSeaSDK } from "opensea-js";
import { AlchemyProvider, ethers } from "ethers";

export const OPENSEA_API_KEY = "f45a6d8840e543e382dba2c25e0069b3";
export const WALLET_PRIV_KEY1 = "8dcd5b5d790d5444e34737302d698b2d392609a67cd5ba81656470db9dce72c8";
export const WALLET_PRIV_KEY2 = "12e16088cf269eb758b9e26464d85b87c71989bc3f414a2fe3d8717ca25bbbef";
export const ALCHEMY_API_KEY_MAINNET = "w7I9IAxAroXbPjGTtAFqN8IlptmpoEK7";

let provider = new AlchemyProvider("matic", ALCHEMY_API_KEY_MAINNET)

export const walletMainnet = new ethers.Wallet(
    WALLET_PRIV_KEY2 as string,
    provider
);

export const WALLET_ADDRESS = walletMainnet.address;

export const sdk = new OpenSeaSDK(
    walletMainnet,
    {
        chain: Chain.Polygon,
        apiKey: OPENSEA_API_KEY,
    },
    (line) => console.info(`MAINNET: ${line}`),
);