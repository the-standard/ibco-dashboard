/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { StakingHistoryListSelector } from "../../..";

type StakingObj = {
    address: string,
    nonce: string,
    tokenId : string,
    open : string,
    stake : string,
    reward : string,
}

type StakeList = {
    stakes: StakingObj[],
    clickFunction: React.MouseEventHandler<string>
}

// @ts-ignore
export const StakingHistoryList = ({stakeHistoryArray}:StakeList) => {
    return (
        <div>
            {
                stakeHistoryArray.length > 0 && stakeHistoryArray.map((stake:StakingObj, index:number) => {
                    //@ts-ignore
                    return <StakingHistoryListSelector key={index} stake={stake} />
                })
            }
        </div>
    )
}