/* eslint-disable @typescript-eslint/ban-ts-comment */
import moment from "moment";
import React from "react";
import { ConvertFrom, TOKENS } from "../../../../../Utils";

type bondInformationType = {
    bondInformation: {
        maturity: string,
        principalOther: string,
        principalSeuro: string,
        profit: string,
        rate: string,
        reward: string,
        tapped: boolean, 
    },
    rewardTokenObj: {
        tokenAddress: string,
        tokenSymbol: string,
        tokenDecimal: number,
    },
    otherToken: {
        otherTokenSymbol:string,
        otherTokenDecimal:number
    },
    clickHandler: React.MouseEventHandler<object>
}

export const UserBondsHistoryList = ({bondInformation, rewardTokenObj, otherToken, clickHandler}:bondInformationType) => {
    const reward = ConvertFrom(bondInformation.reward, rewardTokenObj.tokenDecimal).toFloat();
    const mainAsset = ConvertFrom(bondInformation.principalSeuro, 18).toInt();
    const otherAsset = ConvertFrom(bondInformation.principalOther, parseInt(otherToken.otherTokenDecimal.toString())).toInt();
    const endDate = moment(parseInt(bondInformation.maturity)*1000);
    const claimButtonShow =moment().isSameOrAfter(endDate);

    return(
        <span className="convertInput grid grid-cols-5 gap-2 px-4 py-3 mb-4">
            <p>+{parseInt(bondInformation.rate)/1000}%</p>
            <p>≈{reward.toFixed(2)} {rewardTokenObj.tokenSymbol}</p>
            <p>{mainAsset} {TOKENS.DISPLAY.SEURO} &amp; {otherAsset} {otherToken.otherTokenSymbol}</p>
            <p>{endDate.format('lll')}</p>
            <p>{claimButtonShow && !bondInformation.tapped ? <a href='#' onClick={clickHandler}>Claim</a> : bondInformation.tapped ? <span className="claimed">Claimed</span> : 'Pending'}</p>
        </span>
        
    )
}