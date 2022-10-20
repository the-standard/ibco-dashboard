/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { ChevronLeft } from 'react-feather';
import { toast } from "react-toastify";
import { ClaimRewardContainer, StyledBondHistoryContainer, StyledBackButtonContainer, StyledChevronSpan, StyledBondGridContainer } from './styles';
import { useWeb3Context } from "../../../../../context";
import { ConvertFrom, SmartContractManager, TokenContractManager } from "../../../../../Utils";
import { UserBondsHistoryList } from "../UserBondsHistoryList/UserBondsHistoryList";
import { StyledStakingHistoryContainer } from "../../../StakeStage/Styles";
import { StyledGridHeaders } from './styles';
import { StyledAddressHolderP, StyledCopyButton, StyledDesktopCopyButton, StyledSupplyContainer } from "../../../SwapStage/Styles";

type BondingHistoryInterfaceType = {
    backButton: React.MouseEventHandler<string>,
    otherTokenData:{
        otherTokenSymbol:string,
        otherTokenDecimal:number
    }
}

export const BondingHistoryInterface = ({backButton, otherTokenData}:BondingHistoryInterfaceType) => {
    const { address, web3Provider } = useWeb3Context();
    const [userBonds, setUserBonds] = useState([]);
    const [copied, setCopied] = useState(false);
    const [claimAmount, setClaimAmount] = useState('0');
    const [mobile, setMobile] = useState();
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

    const copyToClipboardClickFunction = () => {
        navigator.clipboard.writeText(tstTokenInfo.tokenAddress).then(() => {toast.success('Copied to clipboard, please import token into MetaMask'); setCopied(true)}).catch(() => {toast.error('Unable to copy address, please manually select and copy'); setCopied(false)});
      }

    return(
        <>        
            {
                // @ts-ignore
                <StyledBackButtonContainer className="mb-4 w-full mx-auto"><a href="#" className="py-1 flex backButton" onClick={backButton}><StyledChevronSpan><ChevronLeft /></StyledChevronSpan> Back</a></StyledBackButtonContainer>
            }
            <StyledBondHistoryContainer className="w-full mx-auto lg:flex md:flex-cols">
                <StyledBondGridContainer>
                <StyledSupplyContainer className="extraMarginBottom">
                    <h2>{tstTokenInfo.tokenSymbol} Address:</h2> <StyledAddressHolderP>{tstTokenInfo.tokenAddress}</StyledAddressHolderP>
                    { mobile ? <StyledCopyButton onClick={copyToClipboardClickFunction}>{copied ? 'Copied to clipboard' : 'Add to MetaMask'}</StyledCopyButton> : <StyledDesktopCopyButton onClick={copyToClipboardClickFunction}>Add to MetaMask</StyledDesktopCopyButton>}
                </StyledSupplyContainer>
                    {
                        !mobile && (
                        <StyledGridHeaders>
                            <span>Profit</span>
                            <span>{tstTokenInfo.tokenSymbol} Amount</span>
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
                                return <UserBondsHistoryList key={index} bondInformation={bond} rewardTokenObj={tstTokenInfo} otherToken={otherTokenData} clickHandler={activateClaim} />
                            })
                            :
                            <p>No Bonds have been created yet</p>
                        }
                    </StyledStakingHistoryContainer>
                </StyledBondGridContainer>
                
                <ClaimRewardContainer>
                {
                    <>
                        <p>claimable reward:</p>
                        <p className="rewardValue"><strong>{parseInt(claimAmount) > 0 ? (ConvertFrom(claimAmount, parseInt(tstTokenInfo.tokenDecimal.toString())).toFloat()).toFixed(2) : '0'} {tstTokenInfo.tokenSymbol}</strong></p>
                        {parseInt(claimAmount) > 0 && <button onClick={activateClaim}>Claim Reward</button>}
                    </>
                }
                </ClaimRewardContainer>
            </StyledBondHistoryContainer>
        </>

    )
};