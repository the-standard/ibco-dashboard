/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { useWeb3Context } from "../../../context";
import { Contract, SmartContractManager, StakingContractManager, TokenContractManager } from "../../../Utils";
import { StakingList } from "./components/StakingList";
import { StakingInterface } from "./components/StakingInterface";
import { StakingHistoryList } from './components/StakingHistoryList';

export const Web3StakingInterface = () => {
    const { address, network, web3Provider } = useWeb3Context();
    const _network = network?.name || 'goerli';
    const [ShowStakingInterface, setShowStakingInterface] = useState(false);
    const [selectedStake, setSelectedStake] = useState<string>();
    const [stakeAddresses, setStakeAddresses] = useState<string[]>([]);
    const [tokenAddress, setTokenAddress] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [stakeHistory, setStakeHistory] = useState<string[]>([]);
    const [stakeFilteredHistory, setStakeFilteredHistory] = useState<string[]>([]);

    const StakingContract = SmartContractManager('StakingDirectory' as Contract, _network).then((data) => data);
    const TokenContract_TST = TokenContractManager(tokenAddress, _network).then((data) => data);

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

   return !ShowStakingInterface ? (
    <>
    <div className="mx-auto mb-4 lg:w-6/12">
        <div className="convertInput text-center p-5">
        <p className="descriptionCopy"><b>What is staking?</b> Similar to the bonding event, a user can transfer their TST during limited time periods. This means that there will be one or multiple campaigns throughout the year where staking is possible with varying interest rates. If the user decides to participate then, at the end of the period, the initial amount of TST is returned to the user and an interest payment on top of it, paid in sEURO.</p>
        </div>
    </div>

    <div className="mx-auto lg:w-6/12">
        <div className="lg:flex supplyContainer mb-10 mr-6 px-5 py-3 w-full ">
            <h2>{tokenSymbol} Address:</h2> <p className="ml-20 addressHolder">{tokenAddress}</p>
        </div>

        <div className="w-full p-5 p-0 my-4 grid grid-cols-5 gap-1">
            <span>Staking Period</span>
            <span>Approx. Reward</span>
            <span>Opening</span>
            <span>Maturity</span>
            <span>Status</span>
        </div>
        <div className="container mx-auto w-full p-0">
            {
                //@ts-ignore
                stakeAddresses.length > 0 ? <StakingList stakes={stakeAddresses} clickFunction={stakeSelectionClickHandler} /> : `No stakes are available`
            }
        </div>
    </div>

    <div className="mx-auto lg:w-6/12 mt-10">
        <h2>History</h2>
        <div className="w-full p-4 my-4 grid grid-cols-4 gap-2 convertInput">
            <span>Your Staking Positions</span>
            <span>Approx. Reward</span>
            <span>Staked Until</span>
        </div>
        <div className="container mx-auto w-full px-4">
            {
                //@ts-ignore
                stakeFilteredHistory.length > 0 ? <StakingHistoryList stakeHistoryArray={stakeFilteredHistory} /> : `You have not staked anything yet, please select from some of the staking options above`
            }
        </div>
    </div>
    </>
    )

    :

    (
        <div className="container mx-auto lg:w-4/12 p-4">
            {
                // @ts-ignore
                <StakingInterface contractAddress={selectedStake} backButton={stakeSelectionClickHandler} />
            }
        </div>
    )
};
