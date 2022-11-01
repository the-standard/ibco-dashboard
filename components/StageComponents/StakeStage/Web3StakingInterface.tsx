/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { useWeb3Context } from "../../../context";
import { isMobile } from "react-device-detect";
import { AddToMetamaskHelper, Contract, SmartContractManager, StakingContractManager, TokenContractManager } from "../../../Utils";
import { StakingList } from "./components/StakingList";
import { StakingInterface } from "./components/StakingInterface";
import { StakingHistoryList } from './components/StakingHistoryList';
import DescriptionContainer from "../../shared/uiElements/DescriptionContainer/DescriptionContainer";
import { StyledAddressHolderP, StyledCopyButton, StyledDesktopCopyButton, StyledSupplyContainer } from "../SwapStage/Styles";
import { StyledStakingHistoryContainer } from "./Styles";
import { StyledGridHeaders } from "./styles/StakingListStyles";

export const Web3StakingInterface = () => {
    const { address, web3Provider } = useWeb3Context();
    const [ShowStakingInterface, setShowStakingInterface] = useState(false);
    const [selectedStake, setSelectedStake] = useState<string>();
    const [stakeAddresses, setStakeAddresses] = useState<string[]>([]);
    const [tokenAddress, setTokenAddress] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [stakeHistory, setStakeHistory] = useState<string[]>([]);
    const [stakeFilteredHistory, setStakeFilteredHistory] = useState<string[]>([]);
    const [mobile, setMobile] = useState();

    const StakingContract = SmartContractManager('StakingDirectory' as Contract).then((data) => data);
    const TokenContract_TST = TokenContractManager(tokenAddress).then((data) => data);

    useEffect(() => {
        //@ts-ignore
        setMobile(isMobile)
      }, [setMobile]);

    useEffect(() => {
        getPositions();
    }, [address, tokenAddress]);

    useEffect(() => {
        stakeAddresses.length > 0 && getTokenAddress(stakeAddresses[0]);
        stakeAddresses.length > 0 && getStakingHistory(stakeAddresses);
    }, [stakeAddresses]);

    useEffect(() => {
        //@ts-ignore
       const newArray = stakeHistory.length > 1 && [...new Map(stakeHistory.map(item => [item['address'], item])).values()];
       newArray && setStakeFilteredHistory(newArray)
    }, [stakeHistory])

    const getTokenAddress = async (stakeAddress:string) => {
        const StakingContract = StakingContractManager(stakeAddress as Contract).then((data) => data);
        const stakingContractInit = await StakingContract;
        //@ts-ignore
        stakingContractInit.methods.TST_ADDRESS().call().then((data:never) => setTokenAddress(data));

        const TokenContract = await TokenContract_TST;
        if(TokenContract && Object.keys(TokenContract).length !== 0) {
            //@ts-ignore
            TokenContract.methods.symbol().call()
            .then((data:never) => setTokenSymbol(data));
        }
    }

    const stakeSelectionClickHandler = (contractAddress:string) => {
        setSelectedStake(contractAddress);
        setShowStakingInterface(!ShowStakingInterface)
    }

    const getPositions = async () => {
        const stakingContract = await StakingContract;
        // @ts-ignore
        web3Provider && Object.keys(stakingContract).length !== 0 && stakingContract.methods.list().call().then((data:string[]) => {
            //@ts-ignore
            setStakeAddresses([...new Set(data)]);
        });
    }

    const getStakingHistory = async (contractAddresses: string[]) => {
        if(contractAddresses.length > 0) {
            contractAddresses.map(async (stakeAddress) => {
                const stakingContract = StakingContractManager(stakeAddress).then((data) => data);
                const _stakeContract = await stakingContract;
                // //@ts-ignore
                _stakeContract && _stakeContract.methods.position(address).call().then((data:never) => {
                    //@ts-ignore
                    const dataCopy = {...data};
                    dataCopy.address = stakeAddress;
                    data['tokenId'] !== '0' && setStakeHistory(prevState => ([...prevState, dataCopy]));
                }).catch((error:never) => console.log('error with positions', error));
            })
            
        }
       
    }

    const copyToClipboardClickFunction = () => {
        tokenAddress && AddToMetamaskHelper(tokenAddress);
    }

   return !ShowStakingInterface ? (
    <>
    <DescriptionContainer>
        <b>What is staking?</b> Similar to the bonding event, a user can transfer their TST during limited time periods. This means that there will be one or multiple campaigns throughout the year where staking is possible with varying interest rates. If the user decides to participate then, at the end of the period, the initial amount of TST is returned to the user and an interest payment on top of it, paid in sEURO.
    </DescriptionContainer>

    <div>
        <StyledSupplyContainer>
              <h2>{tokenSymbol} Address:</h2> <StyledAddressHolderP>{tokenAddress}</StyledAddressHolderP>
             { mobile ? <StyledCopyButton onClick={copyToClipboardClickFunction}>Add to MetaMask</StyledCopyButton> : <StyledDesktopCopyButton onClick={copyToClipboardClickFunction}>Add to MetaMask</StyledDesktopCopyButton>}
            </StyledSupplyContainer>
        {
        !mobile && (
        <StyledGridHeaders>
            <span>Opening</span>
            <span>Status</span>
            <span className="flex2">&nbsp;</span>
        </StyledGridHeaders> 
        )
        
        }
        <div>
            {
                //@ts-ignore
                stakeAddresses.length > 0 ? <StakingList stakes={stakeAddresses} clickFunction={stakeSelectionClickHandler} /> : `No stakes are available`
            }
        </div>
    </div>

    <StyledStakingHistoryContainer>
        <h2>Staking History</h2>
        {
            !mobile &&
            <StyledGridHeaders className='greyBG'>
                <span>Staking Positions</span>
                <span>Reward</span>
                <span>Staked Until</span>
                <span>&nbsp;</span>
                <span>Status</span>
            </StyledGridHeaders>
        }
        <div className="container">
            {
                //@ts-ignore
              stakeFilteredHistory.length > 0 ? <StakingHistoryList stakeHistoryArray={stakeFilteredHistory} /> : <p>You have not staked anything yet, please select from some of the staking options above</p>
            }
        </div>
    </StyledStakingHistoryContainer>
    </>
    )

    :

    (
        <div className="container">
            {
                // @ts-ignore
                <StakingInterface contractAddress={selectedStake} backButton={stakeSelectionClickHandler} />
            }
        </div>
    )
};
