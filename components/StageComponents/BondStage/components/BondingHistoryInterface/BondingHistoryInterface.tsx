/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from "react";
import { ChevronLeft } from 'react-feather';
import { toast } from "react-toastify";
import { ClaimRewardContainer } from './styles';
import { useWeb3Context } from "../../../../../context";
import { ConvertFrom, SmartContractManager, TokenContractManager } from "../../../../../Utils";
import { UserBondsHistoryList } from "../UserBondsHistoryList/UserBondsHistoryList";

type BondingHistoryInterfaceType = {
    backButton: React.MouseEventHandler<string>,
    otherTokenData:{
        otherTokenSymbol:string,
        otherTokenDecimal:number
    }
}

export const BondingHistoryInterface = ({backButton, otherTokenData}:BondingHistoryInterfaceType) => {
    const { address, network, web3Provider } = useWeb3Context();
    const _network = network?.name || 'goerli';
    const [userBonds, setUserBonds] = useState([]);
    const [claimAmount, setClaimAmount] = useState('0');
    const [tstTokenInfo, setTstTokenInfo] = useState({
        tokenAddress: '',
        tokenSymbol: '',
        tokenDecimal: 0
    });
    const BondStorageContract = SmartContractManager('BondStorage').then((data) => data);
    const TSTTokenInfoContract = SmartContractManager('StandardTokenGateway').then((data) => data);
    const TokenContract_TST = TokenContractManager(tstTokenInfo.tokenAddress, _network).then((data) => data);

    useEffect(() => {
        getUserBonds();
        getTSTInfo();
    }, [address])

    useEffect(() => {
        getTSTInfo();
    }, [userBonds, tstTokenInfo.tokenAddress]);

    const getUserBonds = async() => {
        const bondStorageContract = await (await BondStorageContract);
        //@ts-ignore
        web3Provider && bondStorageContract.methods.getUserBonds(address).call().then((data:never) => {
            setUserBonds(data);
        });

        //@ts-ignore
        web3Provider && bondStorageContract.methods.getClaimAmount(address).call().then((data:never) => {
            setClaimAmount(data);
        });
    }

    const getTSTInfo = async() => {
        const tokenContractSM = await (await TSTTokenInfoContract);
        //@ts-ignore
        web3Provider && tokenContractSM.methods.TOKEN().call().then(async (data:never) => {
            const tokenContract = await (await TokenContract_TST);

            setTstTokenInfo(prevState => ({
                ...prevState,
                tokenAddress: data
            }));

            if(tokenContract) {
               // @ts-ignore
                    tokenContract.methods.symbol().call().then((data:never) => {
                    setTstTokenInfo(prevState => ({
                        ...prevState,
                        tokenSymbol: data
                    }))
                });

                // @ts-ignore
                tokenContract.methods.decimals().call().then((data:never) => {
                    setTstTokenInfo(prevState => ({
                        ...prevState,
                        tokenDecimal: parseInt(data)
                    }))
                });
            }

        })
    }

    const activateClaim = async () => {
        const bondStorageContract = await BondStorageContract;
        //@ts-ignore
        await bondStorageContract.methods.claimReward(address).send({from: address}).then(() => {
            toast.success(`All bonds claimed, you have ${claimAmount} ${tstTokenInfo.tokenSymbol}`)
        })
        .catch((error:never) => {
            console.log('error', error);
        })
    };

    return(
        <>        
            {
                // @ts-ignore
                <div className="mb-4 w-full mx-auto"><a href="#" className="py-1 flex backButton" onClick={backButton}><span className="flex w-5"><ChevronLeft /></span> Back</a></div>
            }
            <div className="w-full mx-auto lg:flex md:flex-cols">
                <div className="lg:w-9/12 md:order-1">
                    <div className="w-full grid grid-cols-5 gap-2 mb-4 px-4">
                        <p>Profit</p>
                        <p>{tstTokenInfo.tokenSymbol} Amount</p>
                        <p>Bond</p>
                        <p>Maturity</p>
                        <p>Status</p>
                    </div>
                    <div className="w-full mb-4">
                        {
                            userBonds.length > 0 ?
                            userBonds.map((bond, index) => {
                                return <UserBondsHistoryList key={index} bondInformation={bond} rewardTokenObj={tstTokenInfo} otherToken={otherTokenData} clickHandler={activateClaim} />
                            })
                            :
                            <p>No Bonds have been created yet</p>
                        }
                    </div>
                </div>
                
                <ClaimRewardContainer className="lg:w-2/12 ml-2 p-4 md:order-2">
                {
                parseInt(claimAmount) > 0 ?
                    <>
                        <p>claimable reward:</p>
                        <p className="mt-3"><strong>{(ConvertFrom(claimAmount, parseInt(tstTokenInfo.tokenDecimal.toString())).toFloat()).toFixed(2)} {tstTokenInfo.tokenSymbol}</strong></p>
                        <button className="px-3 py-2 mt-3" onClick={activateClaim}>Claim Reward</button>
                    </>
                    :
                    <p>No Claimable Rewards Yet, but please check back soon</p>
                }
                </ClaimRewardContainer>
            </div>
        </>

    )
};