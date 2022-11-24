/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { useWeb3Context } from "../../../context";
import { AddToMetamaskHelper, Contract, SmartContractManager, StakingContractManager, TokenContractManager } from "../../../Utils";
import { StakingList } from "./components/StakingList";
import { StakingInterface } from "./components/StakingInterface";
import { StakingHistoryList } from './components/StakingHistoryList';
import DescriptionContainer from "../../shared/uiElements/DescriptionContainer/DescriptionContainer";
import { StyledAddressHolderP, StyledCopyButton, StyledDesktopCopyButton, StyledSupplyContainer } from "../SwapStage/Styles";
import { StyledStakingHistoryContainer } from "./Styles";
import { StyledGridHeaders } from "./styles/StakingListStyles";
import { CurrentBreakpoint } from "../../../hooks/BreakpointObserver";

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
    const breakpoint = CurrentBreakpoint();
    const [tstSeuroPrice, setTstSeuroPrice] = useState(0);

    const StakingContract = SmartContractManager('StakingDirectory' as Contract).then((data) => data);
    const StandardTokenContract = SmartContractManager('StandardTokenGateway' as Contract).then((data) =>  data);
    const TokenContract_TST = TokenContractManager(tokenAddress).then((data) => data);

    useEffect(() => {
        if (web3Provider) {
            getTstSeuroPrice();
        }
    }, [web3Provider]);
    

    useEffect(() => {
      //@ts-ignore
      setMobile(breakpoint !== 'desktop');
    }, [setMobile, breakpoint]);

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
    }, [stakeHistory]);

    const getTstSeuroPrice = async () => {
        const standardTokenContractInit = await StandardTokenContract;
        //@ts-ignore
        standardTokenContractInit.methods.priceTstEur().call().then((data:never) => {
            setTstSeuroPrice(data)
        })
    };

    const getTokenAddress = async (stakeAddress:string) => {
        const StakingContract = StakingContractManager(stakeAddress as Contract).then((data) => data);
        const stakingContractInit = await StakingContract;
        //@ts-ignore
        stakingContractInit.methods.TST_ADDRESS().call().then((data:never) => setTokenAddress(data));

        const TokenContract = await TokenContract_TST;
        if(TokenContract && tokenAddress && Object.keys(TokenContract).length !== 0) {
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
    Stage 3: Staking The Standard Token (TST)<br />The yields of this pooled fund will initially be rewarded to TST stakers and later also help the protocol's treasury for R&D, marketing, and expansion. All yields paid out will be paid out in sEURO. Your TST will be locked in until the maturity date.
    </DescriptionContainer>

    <div>
        <StyledSupplyContainer>
              <h2>{tokenSymbol} Address:</h2> <StyledAddressHolderP>{tokenAddress}</StyledAddressHolderP>
             { mobile ? <StyledCopyButton onClick={copyToClipboardClickFunction}>Add to MetaMask</StyledCopyButton> : <StyledDesktopCopyButton onClick={copyToClipboardClickFunction}>Add to MetaMask</StyledDesktopCopyButton>}
        </StyledSupplyContainer>

        <StyledSupplyContainer className="extraMarginTop">
              <h2>{tokenSymbol} Current Price:</h2> <StyledAddressHolderP>{((tstSeuroPrice / 100000000)).toLocaleString(undefined, { minimumFractionDigits: 2 })} sEURO</StyledAddressHolderP>
        </StyledSupplyContainer>
        {
        !mobile && (
        <StyledGridHeaders>
            <span>Opening</span>
            <span>Status</span>
            <span>Maturity</span>
            <span>&nbsp;</span>
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
