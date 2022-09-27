/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from "react";
import { StakingContractManager } from "../../../../Utils";
import { StakingSelector } from "./StakingSelector";

type StakingObj = {
    address: string,
    maturity : string,
    start : string,
    end : string,
    interestRate : string,
    isActive:boolean,
}

type StakeList = {
    stakes: StakingObj[],
    clickFunction: React.MouseEventHandler<string>
}

// @ts-ignore
export const StakingList = ({stakes, clickFunction}:StakeList) => {
    const ArrayCopy = [...stakes];
    const sortedStakes = ArrayCopy.sort((a,b) => (parseInt(a.start) > parseInt(b.start)) ? 1 : ((parseInt(b.start) > parseInt(a.start)) ? -1 : 0))
    const [stakeInfo, setStakeInfo] = useState<StakingObj[]>([]);

    useEffect(() => {
        //@ts-ignore
        stakes.length > 0 ? sortedStakes.map(async (stake:string) => {
            const hasElemInArray = stakeInfo.some( stakeInfo => stakeInfo['address'] === stake )
            const _stakeInfo = await getStakingObject(stake);
            !hasElemInArray && setStakeInfo(prevState => [...prevState, _stakeInfo]);
        }):
        'Loading Stake Options...'
    }, []);

    const getStakingObject = async (contractAddress:string) => {
        const stakingContract = StakingContractManager(contractAddress).then((data) => data);
        const stakingObj:StakingObj = {
            address: contractAddress,
            maturity: '0',
            start: '0',
            end: '0',
            interestRate: '0',
            isActive: true,
        };
        // @ts-ignore
        await(await stakingContract).methods.maturity().call().then((data:string) => {
            stakingObj.maturity = data;
        });
        // @ts-ignore
        await(await stakingContract).methods.windowStart().call().then((data:string) => {
            stakingObj.start = data;
        });
        // @ts-ignore
        await(await stakingContract).methods.windowEnd().call().then((data:string) => {
            stakingObj.end = data;
        });
        // @ts-ignore
        await(await stakingContract).methods.SI_RATE().call().then((data:string) => {
            stakingObj.interestRate = data;
        });
        // @ts-ignore
        await(await stakingContract).methods.active().call().then((data:boolean) => {
            stakingObj.isActive = data;
        });

        return stakingObj;
    };

    return (
        <div>
            {
                // @ts-ignore
                stakeInfo.length > 0 && stakeInfo.map((stake:StakingObj) => (stake.isActive && <StakingSelector key={stake.address} stakingObj={stake} clickFunction={clickFunction} />))
            }
        </div>
        
    )
}