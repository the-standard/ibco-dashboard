/* eslint-disable @typescript-eslint/ban-ts-comment */
import moment from "moment";
import React from "react";
import { ConvertFrom, TOKENS } from "../../../../../Utils";
import { StyledBondHistoryItemContainer, StyledClaimButton, StyledP, StyledTangoContainer, StyledProfitContainer, StyledProfitTitleP } from "./UserBondsHistoryListStyles";

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
    }
}

export const UserBondsHistoryList = ({bondInformation, rewardTokenObj, otherToken}:bondInformationType) => {
    const reward = ConvertFrom(bondInformation.reward, rewardTokenObj.tokenDecimal).toFloat();
    const mainAsset = ConvertFrom(bondInformation.principalSeuro, 18).toInt();
    const otherAsset = ConvertFrom(bondInformation.principalOther, parseInt(otherToken.otherTokenDecimal.toString())).toInt();
    const endDate = moment(parseInt(bondInformation.maturity)*1000);
    const claimButtonShow =moment().isSameOrAfter(endDate);

    return(
        <StyledBondHistoryItemContainer>
            <StyledProfitContainer>
                <StyledProfitTitleP>Profit</StyledProfitTitleP>
                <p className="amount">+{parseInt(bondInformation.rate)/1000}%</p>
            </StyledProfitContainer>

            <StyledTangoContainer>
            <StyledP>{rewardTokenObj.tokenSymbol} Amount</StyledP>
            <p>≈{reward.toFixed(2)} {rewardTokenObj.tokenSymbol}</p>
            </StyledTangoContainer>
      
            <StyledP>Bond</StyledP>
            <p>{mainAsset} {TOKENS.DISPLAY.SEURO} &amp; {otherAsset} {otherToken.otherTokenSymbol}</p>

            <StyledP>Maturity</StyledP>
            <p>{endDate.format('lll')}</p>

            <StyledClaimButton>{claimButtonShow && !bondInformation.tapped ? <a>Claim</a> : bondInformation.tapped ? <span className="claimed">Claimed</span> : 'Pending'}</StyledClaimButton>
        </StyledBondHistoryItemContainer>
    )
}
