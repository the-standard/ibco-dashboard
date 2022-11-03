/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { ChevronLeft } from 'react-feather';
import { toast } from "react-toastify";
import { ClaimRewardContainer, StyledBondHistoryContainer, StyledBackButtonContainer, StyledChevronSpan, StyledBondGridContainer } from './styles';
import { useWeb3Context } from "../../../../../context";
import { useRouter } from "next/router";
import { AddToMetamaskHelper, ConvertFrom, SmartContractManager, TokenContractManager } from "../../../../../Utils";
import { UserBondsHistoryList } from "../UserBondsHistoryList/UserBondsHistoryList";
import { StyledStakingHistoryContainer } from "../../../StakeStage/Styles";
import { StyledGridHeaders } from './styles';
import { StyledAddressHolderP, StyledCopyButton, StyledDesktopCopyButton, StyledSupplyContainer } from "../../../SwapStage/Styles";

type BondingHistoryInterfaceType = {
    otherTokenData:{
        otherTokenSymbol:string,
        otherTokenDecimal:number
    }
}

export const BondingHistoryInterface = ({otherTokenData}:BondingHistoryInterfaceType) => {
    const { address, web3Provider } = useWeb3Context();
    const router = useRouter();
    const [time, setTime] = useState(30);
    const [userBonds, setUserBonds] = useState([]);
    const [claimAmount, setClaimAmount] = useState('0');
    const [mobile, setMobile] = useState();
    const [disableClaim, setDisableClaim] = useState(false);
    const [tstTokenInfo, setTstTokenInfo] = useState({
        tokenAddress: '',
        tokenSymbol: '',
        tokenDecimal: 0
    });
    const BondStorageContract = SmartContractManager('BondStorage').then((data) => data);
    const TSTTokenInfoContract = SmartContractManager('StandardTokenGateway').then((data) => data);
    const TokenContract_TST = TokenContractManager(tstTokenInfo.tokenAddress).then((data) => data);

    useEffect(() => {
        //@ts-ignore
        setMobile(isMobile)
      }, [setMobile]);

    useEffect(() => {
        getUserBonds();
        getTSTInfo();
    }, [address])

    useEffect(() => {
        getTSTInfo();
    }, [userBonds, tstTokenInfo.tokenAddress]);

    useEffect(() => {
        //@ts-ignore
        let timer;

        if(userBonds.length > 0 && !disableClaim) {
            timer = setInterval(() => {
                if (time > 0) {
                    setTime(time => time - 1);
                }
              }, 1000);

              if(time <= 0) {
                clearInterval(timer);
                setTime(30);
                getUserBonds();
              }
            //@ts-ignore
              return () => clearInterval(timer);
        } else {
            clearInterval(timer)
        }
    }, [time, userBonds])

   // const refreshIntervalTimer = setInterval(() => {getUserBonds()}, 30000);

    const getUserBonds = async() => {
        setUserBonds([]);
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
        setDisableClaim(true);
        const bondStorageContract = await BondStorageContract;
        const formattedValue = ConvertFrom(claimAmount, tstTokenInfo.tokenDecimal).toFloat().toFixed(2);
        //@ts-ignore
        await bondStorageContract.methods.claimReward(address).send({from: address}).then(() => {
            toast.success(`Your reward of ${formattedValue} ${tstTokenInfo.tokenSymbol} has successfully been paid out.`);
            getUserBonds();
        })
        .catch((error:never) => {
            setDisableClaim(false);
            console.log('error', error);
        })
    };

    const copyToClipboardClickFunction = () => {
        tstTokenInfo.tokenAddress && AddToMetamaskHelper(tstTokenInfo.tokenAddress);
    }

    const backButton = () => router.push({query: {}})

    return(
        <>        
            {
                // @ts-ignore
                <StyledBackButtonContainer><a href="#" className="backButton" onClick={backButton}><StyledChevronSpan><ChevronLeft /></StyledChevronSpan> Back</a></StyledBackButtonContainer>
            }
            <StyledBondHistoryContainer>
                <StyledBondGridContainer>
                <StyledSupplyContainer className="extraMarginBottom">
                    <h2>{tstTokenInfo.tokenSymbol} Address:</h2> <StyledAddressHolderP>{tstTokenInfo.tokenAddress}</StyledAddressHolderP>
                    { mobile ? <StyledCopyButton onClick={copyToClipboardClickFunction}>Add to MetaMask</StyledCopyButton> : <StyledDesktopCopyButton onClick={copyToClipboardClickFunction}>Add to MetaMask</StyledDesktopCopyButton>}
                </StyledSupplyContainer>
                    {
                        !mobile && (
                        <StyledGridHeaders>
                            <span style={{maxWidth: "30px"}}>Profit</span>
                            <span style={{maxWidth: "150px"}}>{tstTokenInfo.tokenSymbol} Amount</span>
                            <span>Bond</span>
                            <span>Maturity</span>
                            <span>Status</span>
                        </StyledGridHeaders> 
                        )
                    }
                    
                    <StyledStakingHistoryContainer>
                        {
                            userBonds.length > 0 ?
                            userBonds.map((bond, index) => {
                                return <UserBondsHistoryList key={index} bondInformation={bond} rewardTokenObj={tstTokenInfo} otherToken={otherTokenData} />
                            })
                            :
                            <p>No Bonds have been created yet</p>
                        }
                    </StyledStakingHistoryContainer>
                    {userBonds.length > 0 && !disableClaim && <p className="timer">Time until refresh: {time} {time > 1 ? 'seconds' : 'second'}</p>}
                </StyledBondGridContainer>
                
                <ClaimRewardContainer>
                {
                    <>
                        <p>Claimable reward:</p>
                        <p className="rewardValue"><strong>{parseInt(claimAmount) > 0 ? (ConvertFrom(claimAmount, parseInt(tstTokenInfo.tokenDecimal.toString())).toFloat()).toFixed(2) : '0'} {tstTokenInfo.tokenSymbol}</strong></p>
                        {parseInt(claimAmount) > 0 && <button disabled={disableClaim} onClick={activateClaim}>Claim Reward</button>}
                    </>
                }
                </ClaimRewardContainer>
            </StyledBondHistoryContainer>
        </>

    )
};
