/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify";
import { useWeb3Context } from "../../../context";
import { Contract, SmartContractManager, StakingContractManager, TokenContractManager } from "../../../Utils";
import { StakingList } from "./components/StakingList";
import { StakingInterface } from "./components/StakingInterface";

export const Web3StakingInterface = () => {
    const { address, network } = useWeb3Context();
    const _network = network?.name || 'goerli';
    const [ShowStakingInterface, setShowStakingInterface] = useState(false);
    const [selectedStake, setSelectedStake] = useState<string>();
    const [stakeAddresses, setStakeAddresses] = useState<string[]>([]);
    const [tokenAddress, setTokenAddress] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');

    const StakingContract = SmartContractManager('StakingDirectory' as Contract, _network).then((data) => data);
    const TokenContract_TST = TokenContractManager(tokenAddress, _network).then((data) => data);

    useEffect(() => {
        getPositions();
    }, [address, tokenAddress]);

    useEffect(() => {
        stakeAddresses.length > 0 && getTokenAddress(stakeAddresses[0]);
    }, [stakeAddresses])

    const getTokenAddress = async (stakeAddress:string) => {
        const StakingContract = StakingContractManager(stakeAddress as Contract).then((data) => data);
        const stakingContractInit = await (await StakingContract);
        //@ts-ignore
        stakingContractInit.methods.TST_ADDRESS().call().then((data:never) => setTokenAddress(data)).catch((error:never) => console.log('TST_ADDRESS error', error));

        const TokenContract = await (await TokenContract_TST);

        if(TokenContract && Object.keys(TokenContract).length !== 0) {
        TokenContract.methods.symbol().call()
        .then((data:never) => setTokenSymbol(data))
        .catch((error:never) => console.log('error getting token symbol', error));
        }
    }

    const stakeSelectionClickHandler = (contractAddress:string) => {
        setSelectedStake(contractAddress);
        setShowStakingInterface(!ShowStakingInterface)
    }

    const getPositions = async () => {
        const stakingContract = await (await StakingContract);
        // @ts-ignore
        Object.keys(stakingContract).length !== 0 && stakingContract.methods.list().call().then((data:string[]) => {
            //@ts-ignore
            setStakeAddresses([...new Set(data)]);
        }).catch((error: never) => {
            toast.error(`getPositions: ${error}`);
        });
    }

   return !ShowStakingInterface ? (
    <>
    <div className="container mx-auto w-8/12 p-4 convertInput">{tokenSymbol} address: {tokenAddress}</div>
    <div className="mx-auto w-8/12 p-5 pb-0 grid grid-cols-4 gap-1">
        <span>Staking Period</span>
        <span>Approx. Reward</span>
        <span>Opening</span>
        <span>Status</span>
    </div>
    <div className="container mx-auto w-8/12 p-4">
        {
            //@ts-ignore
            stakeAddresses.length > 0 ? <StakingList stakes={stakeAddresses} clickFunction={stakeSelectionClickHandler} /> : `No stakes are available`
        }
    </div>
    </>
        
    )

    :

    (
        <div className="container mx-auto w-4/12 p-4">
            {
                // @ts-ignore
                <StakingInterface contractAddress={selectedStake} backButton={stakeSelectionClickHandler} />
            }
        </div>
    )
};