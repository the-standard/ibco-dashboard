/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import Web3 from 'web3';
import { Contract } from '../Utils';

// JSON Imports
import ERC20ABI from '../public/erc20.json';

type AbiType = 'function' | 'constructor' | 'event' | 'fallback';
type StateMutabilityType = 'pure' | 'view' | 'nonpayable' | 'payable';

interface AbiInput {
    name: string;
    type: string;
    indexed?: boolean;
	components?: AbiInput[];
    internalType?: string;
}

interface AbiOutput {
    name: string;
    type: string;
	components?: AbiOutput[];
    internalType?: string;
}

interface AbiItem {
    anonymous?: boolean;
    constant?: boolean;
    inputs?: AbiInput[];
    name?: string;
    outputs?: AbiOutput[];
    payable?: boolean;
    stateMutability?: StateMutabilityType;
    type: AbiType;
    gas?: number;
}

const getContractABI = async(contract:string) => {
    return await axios.get(`https://storage.googleapis.com/abiapi/ibco/${contract}.json`).then((data) => data)
}

const getContractAddressessJson = async() => {
    const location = process.env.NEXT_PUBLIC_ENV !== 'prod' ? 'beta' : process.env.NEXT_PUBLIC_ENV;
    console.log('environment location', location);
    return await axios.get(`https://raw.githubusercontent.com/the-standard/ibco-addresses/main/addresses.${location}.json`).then((data) => {
        console.log('using address list:', data);
        return data
    })
}

/**
 * Initializes Web3 with the wallet provider
 * @constructor
 * @returns {object} A Web3 interface for the given wallet network and connection
 */
export const Web3Manager = () => {
    const _interface = new Web3(Web3.givenProvider);

    return _interface;
}

/**
 * Initializes a contract with Web3 for a certain token
 * @constructor
 * @param {Tokens} token - The token you wish to create a contract for
 * @param {string} network - The name of the connected wallet network
 * @returns {object} A contract object from Web3
 */
export const TokenContractManager = async (token:string) => {
    const web3Interface = Web3Manager();
    // @ts-ignore
    const ERC20ABIItem:AbiItem = ERC20ABI;
    //@ts-ignore
    const tokenAddress = token !== null && token.slice(0,2) === '0x' && token;

    if (tokenAddress !== undefined) {
        console.log('conecting to token contract address:', tokenAddress);
        // @ts-ignore
        const contract = new web3Interface.eth.Contract(ERC20ABIItem, tokenAddress);

        return contract
    }
}

/**
 * Initializes a contract with Web3 to connect to smart contracts elsewhere
 * @constructor
 * @param {string} contract - The name of the smart contract you want to create a contract for
 * @param {string} network - The name of the connected wallet network
 * @returns {object} A contract object from Web3
 */
export const SmartContractManager = async (contract:Contract) => {
    const web3Interface = Web3Manager();
    const _network = await web3Interface.eth.net.getNetworkType() === 'main' ? 'mainnet' : 'goerli';

    return await getContractABI(contract)
                    .then(async (ABIData) => {
                        return await GetJsonAddresses()
                            .then(async (contractAddress) => {
                                console.log('conecting to contract:', contract, 'at address:',  contractAddress[_network]['CONTRACT_ADDRESSES'][contract]);
                                const _contract = new web3Interface.eth.Contract(ABIData['data'].abi, contractAddress[_network]['CONTRACT_ADDRESSES'][contract]);

                                return _contract
                            })
                    })
                    .catch((error) => console.log('unable to retrieve ABI data', error))
}

/**
 * Initializes a contract with Web3 to connect to staking contracts elsewhere
 * @constructor
 * @param {string} contractAddress - The address of the stake you want to create a contract for
 * @returns {object} A contract object from Web3
 */
export const StakingContractManager = async (contractAddress:string) => {
    const web3Interface = Web3Manager();

        return await getContractABI('Staking')
                        .then(async (data) => {
                            //@ts-ignore
                            return new web3Interface.eth.Contract(data['data'].abi, contractAddress);
                        })
                        .catch((error) => console.log('unable to retrieve Staking ABI data', error))
};

export const GetJsonAddresses = async () => {
    return await getContractAddressessJson()
        .then(async (data) => {
            //@ts-ignore
            return data['data']
        })
        .catch((error) => console.log('unable to retrieve ContractAddresses data', error));
    };