/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from "react";
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
    const [filteredHistoryArray, setFilteredHistoryArray] = useState<StakingObj[]>([]);

    useEffect(() => {
        const arrayCopy = [...stakeHistoryArray];
        const filteredArray = [...new Set(arrayCopy)];
        stakeHistoryArray.length > 0 && setFilteredHistoryArray(filteredArray);
    }, []);

    return (
        <div>
            {
                filteredHistoryArray.length > 0 && filteredHistoryArray.map((stake:StakingObj, index:number) => {
                    //@ts-ignore
                    return stake.address && <StakingHistoryListSelector key={index} stake={stake} />
                })
            }
        </div>
    )
}