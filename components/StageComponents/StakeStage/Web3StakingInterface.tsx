/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify";
import { useWeb3Context } from "../../../context";
import { Contract, SmartContractManager } from "../../../Utils";
import { StakingList } from "./components/StakingList";
import { StakingInterface } from "./components/StakingInterface";

export const Web3StakingInterface = () => {
    const { address, network } = useWeb3Context();
    const _network = network?.name || 'goerli';
    const [ShowStakingInterface, setShowStakingInterface] = useState(false);
    const [selectedStake, setSelectedStake] = useState<string>();
    const [stakeAddresses, setStakeAddresses] = useState<string[]>([]);
    const StakingContract = SmartContractManager('StakingDirectory' as Contract, _network).then((data) => { return data });

    useEffect(() => {
        getPositions();
    }, [address]);

    const stakeSelectionClickHandler = (contractAddress:string) => {
        setSelectedStake(contractAddress);
        setShowStakingInterface(!ShowStakingInterface)
    }

    const getPositions = async () => {
        //console.log('await (await StakingContract)', await (await StakingContract));
        // @ts-ignore
        await (await StakingContract).methods.list().call().then((data:string[]) => {
            //@ts-ignore
            setStakeAddresses([...new Set(data)]);
        }).catch((error: never) => {
            toast.error(`getPositions: ${error}`);
        });
    }

   return !ShowStakingInterface ? (
    <>
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