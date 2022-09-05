/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from "react";
import { ChevronLeft } from 'react-feather';
import { toast } from "react-toastify";
import { ClaimRewardContainer } from './styles';
import { useWeb3Context } from "../../../../../context";
import { SmartContractManager, TokenContractManager } from "../../../../../Utils";
import { UserBondsHistoryList } from "../UserBondsHistoryList/UserBondsHistoryList";

type BondingHistoryInterfaceType = {
    backButton: React.MouseEventHandler<string>,
    otherTokenData:{
        otherTokenSymbol:string,
        otherTokenDecimal:number
    }
}

export const BondingHistoryInterface = ({backButton, otherTokenData}:BondingHistoryInterfaceType) => {
    const { address, network } = useWeb3Context();
    const _network = network?.name || 'goerli';
    const [userBonds, setUserBonds] = useState([]);
    const [claimAmount, setClaimAmount] = useState('0');
    const [tstTokenInfo, setTstTokenInfo] = useState({
        tokenAddress: '',
        tokenSymbol: '',
        tokenDecimal: 0
    });
    const BondStorageContract = SmartContractManager('BondStorage', _network).then((data) => data);
    const TSTTokenInfoContract = SmartContractManager('StandardTokenGateway', _network).then((data) => data);
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
        bondStorageContract.methods.getUserBonds(address).call().then((data:never) => {
            setUserBonds(data);
        })
        .catch((error:never) => {
            toast.error(`Error getting user bonds: ${error}`)
        });

        //@ts-ignore
        bondStorageContract.methods.getClaimAmount(address).call().then((data:never) => {
            setClaimAmount(data);
        })
        .catch((error:never) => {
            console.log('error retrieving claim amount', error);
        })
    }

    const getTSTInfo = async() => {
        const tokenContractSM = await (await TSTTokenInfoContract);
        //@ts-ignore
        tokenContractSM.methods.TOKEN().call().then(async (data:never) => {
            const tokenContract = await (await TokenContract_TST);

            setTstTokenInfo(prevState => ({
                ...prevState,
                tokenAddress: data
            }));

            if(tokenContract) {
                    tokenContract.methods.symbol().call().then((data:never) => {
                    setTstTokenInfo(prevState => ({
                        ...prevState,
                        tokenSymbol: data
                    }))
                });

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
        const bondStorageContract = await(await BondStorageContract);

        //@ts-ignore
        bondStorageContract.methods.claimReward(address).call().then((data: never) => {
            console.log('claim success', data);
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
            <div className="w-full mx-auto flex">
                <div className="w-9/12">
                    <div className="w-full grid grid-cols-5 gap-2 mb-4 px-4">
                        <p>Profit</p>
                        <p>{tstTokenInfo.tokenSymbol} Amount</p>
                        <p>Bond</p>
                        <p>Maturity</p>
                        <p>Status</p>
                    </div>
                    <div className="w-full mb-4">
                        {
                            userBonds.map((bond, index) => {
                                return <UserBondsHistoryList key={index} bondInformation={bond} rewardTokenObj={tstTokenInfo} otherToken={otherTokenData} clickHandler={activateClaim} />
                            })
                        }
                    </div>
                </div>
                
                <ClaimRewardContainer className="w-2/12 ml-2 p-4">
                {
                parseInt(claimAmount) > 0 ?
                    <>
                        <p>claimable reward:</p>
                        <p className="mt-3"><strong>{claimAmount} {tstTokenInfo.tokenSymbol}</strong></p>
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