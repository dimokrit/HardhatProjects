import { useSDK } from '@metamask/sdk-react';
import { $baseApi } from '../../api/api_keystone';
import { ethers, keccak256 } from 'ethers';
import { MerkleTree } from "merkletreejs"
import ABI from "./ABI.json"
import whiteList from "./whiteList.json"

const abiCoder = ethers.AbiCoder.defaultAbiCoder();
function encodeLeaf(address: any) {
    // Same as `abi.encodePacked` in Solidity
    return abiCoder.encode(
        ["address"], // The datatypes of arguments to encode
        [address] // The actual values
    )
}

export async function mint() {
    if (!window.ethereum) {
        // screen.width > 600
        //   ? window.open("https://metamask.io/download/")
        //   : alert('please install MetaMask');
        return;
    }
    try {
        const chainId = 137; //137 for production
        console.log(ethers.toBeHex(chainId).replace("0x0", "0x"));
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ethers.toBeHex(chainId).replace("0x0", "0x") }]
            });
        } catch (error: any) {
            console.log(error)
            // This error code indicates that the chain has not been added to MetaMask
            if (error.code === 4902)
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            // chainName: 'Mumbai',
                            // chainId: ethers.toBeHex(chainId),
                            // nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                            // rpcUrls: ['https://rpc-mumbai.maticvigil.com']
                            chainName: 'Polygon Mainnet',
                            chainId: ethers.toBeHex(chainId),
                            nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                            rpcUrls: ['https://polygon-rpc.com/']
                        }
                    ]
                });
        }
        const provider = new ethers.BrowserProvider(window.ethereum, chainId);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        // Using keccak256 as the hashing algorithm, create a Merkle Tree
        // We use keccak256 because Solidity supports it
        // We can use keccak256 directly in smart contracts for verification
        // Make sure to sort the tree so it can be reproduced deterministically each time
        const merkleTree = new MerkleTree(whiteList, keccak256, {
            hashLeaves: true, // Hash each leaf using keccak256 to make them fixed-size
            sortPairs: true, // Sort the tree for determinstic output
            sortLeaves: true,
        });

        if (address) {
            const leaf = keccak256(encodeLeaf(address)); // The hash of the node
            const proof = merkleTree.getHexProof(leaf)
            //const _contractAddress = "0x6941c56C1Ce309D29F48146eE09680aEcceEd6ca";
            const _contractAddress = "0xFAC14CEF2A42215e597D4f66B8FDF90d59bbD422";
            const nagaNFT_Contract = new ethers.Contract(_contractAddress, ABI, signer)
            nagaNFT_Contract.freeMint(proof).then(function(res) {console.log(res)}, function(err: any) {console.log(err["revert"]["args"][0])})
        }
    } catch (err) {
        console.error(`failed to connect: ${err}`);
    }
  };

export async function connectWeb3() {
    // if (!window.ethereum) {
    //     alert('please install MetaMask');``
    //     return;
    // }
    // try {
    //     const chainId = 80001
    //     console.log(ethers.toBeHex(chainId).replace("0x0", "0x"))
    //     await window.ethereum.request({ method: 'eth_requestAccounts' });

    //     try {
    //         await window.ethereum.request({
    //             method: 'wallet_switchEthereumChain',
    //             params: [{ chainId: ethers.toBeHex(chainId).replace("0x0", "0x") }]
    //         });
    //     } catch (error: any) {
    //         console.log(error)
    //         // This error code indicates that the chain has not been added to MetaMask
    //         if (error.code === 4902)
    //             await window.ethereum.request({
    //                 method: 'wallet_addEthereumChain',
    //                 params: [
    //                     {
    //                         chainName: 'Mumbai',
    //                         chainId: ethers.toBeHex(chainId),
    //                         nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
    //                         rpcUrls: ['https://rpc-mumbai.maticvigil.com']
    //                         // chainName: 'Polygon Mainnet',
    //                         // chainId: web3.utils.toHex(chainId),
    //                         // nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
    //                         // rpcUrls: ['https://polygon-rpc.com/']
    //                     }
    //                 ]
    //             });
    //     }
    //     const provider = new ethers.BrowserProvider(window.ethereum, chainId);
    //     const signer = await provider.getSigner();
    //     const address = await signer.getAddress();
    //     if (address) {
    //         const data = { "wallet": address };
    //         const response = await $baseApi.post('/web3/web3Auth', data);
    //         console.log(response.data);
    //     }

    // } catch (err) {
    //     console.warn(`failed to connect..`, err);
    // }
};
