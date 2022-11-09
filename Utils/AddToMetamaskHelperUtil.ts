/* eslint-disable @typescript-eslint/ban-ts-comment */
import { TokenContractManager, Web3Manager } from ".";

export const AddToMetamaskHelper = (address:string) => {
    const web3 = Web3Manager();
    const TokenContract = TokenContractManager(address).then((data) => data);
    let decimals = 0;

    const getTokenInformation = async() => {
        const tokenContractInit = await TokenContract;

        tokenContractInit?.methods.decimals().call().then((data:never) => {
            decimals = parseInt(data);
        });

        tokenContractInit?.methods.symbol().call().then((data:never) => {
            //@ts-ignore
            web3.currentProvider.sendAsync({
                method: 'wallet_watchAsset',
                params: {
                type: 'ERC20',
                options: {
                    address: `${address}`,
                    symbol: `${data}`,
                    decimals: decimals,
                },
                },
                id: 20,
            });
        });
    }

    getTokenInformation();
};