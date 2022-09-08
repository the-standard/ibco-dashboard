/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../../../../context";
import { ConvertFrom, StakingContractManager, TokenContractManagerNoHooks, TOKENS } from "../../../../Utils";

type StakingObj = {
    address: string,
    nonce: string,
    tokenId : string,
    open : string,
    stake : string,
    reward : string,
}

type StakeList = {
    stakes: StakingObj[],
    clickFunction: React.MouseEventHandler<string>
}

type TokenInformationType = {
    tokenAddress: string,
    symbol: string,
    decimal: number
}

const defaultTokenObj = {
    tokenAddress: '',
    symbol: '',
    decimal: 18
}

// @ts-ignore
export const StakingHistoryList = ({stakeHistoryArray}:StakeList) => {
    const { network } = useWeb3Context();
    const _network = network?.name || 'goerli';

    const [tokenAddresses, setTokenAddresses] = useState({SEURO_ADDRESS: '', TST_ADDRESS: ''});
    const [tstTokenInfo, setTstTokenInfo] = useState<TokenInformationType>(defaultTokenObj);
    const [seuroTokenInfo, setseuroTokenInfo] = useState<TokenInformationType>(defaultTokenObj);
    const [filteredHistoryArray, setFilteredHistoryArray] = useState<StakingObj[]>([]);

    const stakingContractInit = filteredHistoryArray.length > 0 && StakingContractManager(filteredHistoryArray[0].address).then((data) => data) || null;

    useEffect(() => {
        const arrayCopy = [...stakeHistoryArray];
        const filteredArray = [...new Set(arrayCopy)];
        stakeHistoryArray.length > 0 && setFilteredHistoryArray(filteredArray);
    }, []);

    useEffect(() => {
        getTokenAddresses();
    }, [stakingContractInit !== null])

    useEffect(() => {
        if (tokenAddresses.SEURO_ADDRESS !== '' && tokenAddresses.TST_ADDRESS !== '') {
            getTokenInformation(tokenAddresses.SEURO_ADDRESS).then((data) => {
                setseuroTokenInfo(prevState => ({...prevState, decimals: data.decimals, symbol: data.symbol}))
            });

            getTokenInformation(tokenAddresses.TST_ADDRESS).then((data) => {
                setTstTokenInfo(prevState => ({...prevState, decimals: data.decimals, symbol: data.symbol}))
            });
        }
    }, [tokenAddresses])

    const getTokenAddresses = async () => {
        const stakingContract = await stakingContractInit;

        if (stakingContract) {
            //@ts-ignore
            stakingContract.methods.SEURO_ADDRESS().call().then((data:never) => {
                setTokenAddresses(prevState => ({...prevState, SEURO_ADDRESS: data}));
            });

            //@ts-ignore
            stakingContract.methods.TST_ADDRESS().call().then((data:never) => {
                setTokenAddresses(prevState => ({...prevState, TST_ADDRESS: data}));
            });
        }
    }

    const getTokenInformation = async (address:string) => {
        //@ts-ignore
        const tokenContractInit = TokenContractManagerNoHooks(address, _network).then((data:never) => data);

        const tokenInfoObj = {
            decimals: 0,
            symbol: ''
        };

        //@ts-ignore
        await(await tokenContractInit).methods.symbol().call().then((data:never) => {
            tokenInfoObj.symbol = data;
        });
        //@ts-ignore
        await(await tokenContractInit).methods.decimals().call().then((data:never) => {
            tokenInfoObj.decimals = parseInt(data);
        });

        return tokenInfoObj;
    };

    return (
        <div>
            {
                filteredHistoryArray.length > 0 && filteredHistoryArray.map((stake:StakingObj, index:number) => {
                    return (
                        <div key={index} className="grid grid-cols-4 gap-2">
                            <span>{ConvertFrom(stake.stake, parseInt(tstTokenInfo.decimal.toString())).toFloat()} {tstTokenInfo.symbol}</span>
                            <span>{ConvertFrom(stake.reward, parseInt(seuroTokenInfo.decimal.toString())).toFloat()} {TOKENS.DISPLAY.SEURO}</span>
                            <span>staking until</span>
                            <span>some button</span>
                        </div>
                    )
                })
            }
        </div>
    )
}