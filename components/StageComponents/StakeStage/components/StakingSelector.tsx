/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import moment from 'moment';
import { StyledDurationContainer, StyledInterestRateContainer, StyledStakeButton, StyledStakingListContainer, StyledStatusContainer, StyledTitleP, StyledTransactionButtonContainer } from "../styles/StakingListStyles";

type StakingObj = {
    address: string,
    maturity : string,
    start : string,
    end : string,
    interestRate : string,
    isActive: boolean,
}

type StakeList = {
    stakingObj: StakingObj,
    clickFunction: React.MouseEventHandler<string>
}

export const StakingSelector = ({stakingObj, clickFunction}:StakeList) => {
    const startPeriod = moment(parseInt(stakingObj.start)*1000);
    const endPeriod = moment(parseInt(stakingObj.end)*1000);
    const [hasOpened, setHasOpened] = useState(false);

    const isStakeOpen = hasOpened && moment().isAfter(endPeriod);
    const [mobile, setMobile] = useState();
    
    useEffect(() => {
      //@ts-ignore
      setMobile(isMobile)
    }, [setMobile]);
    
    useEffect(() => {
        setHasOpened(moment().isSameOrBefore(endPeriod) && moment().isSameOrAfter(startPeriod));
    }, [moment, stakingObj])

    return (
        <StyledStakingListContainer className={isStakeOpen ? 'stakeOpen' : ''}>
            <StyledDurationContainer>
                <StyledTitleP>Opening</StyledTitleP>
                { 
                    startPeriod.format('ll')
                }
            </StyledDurationContainer>
            {
             mobile &&  <StyledInterestRateContainer>
                    <StyledTitleP>Reward</StyledTitleP>
                    {
                        `+${parseInt(stakingObj.interestRate) / 1000}%`
                    }
                </StyledInterestRateContainer>
            }
            <StyledStatusContainer>
                {
                    !hasOpened ? moment().isAfter(endPeriod) ? <span className="closed">Closed</span> : <span className="openSoon">Opening Soon</span>: <span className="openNow">Open Now</span>
                }
            </StyledStatusContainer>

            {/* <StyledMaturityContainer>
                <StyledTitleP>Maturity</StyledTitleP>
                {
                    maturity.format('ll')
                }
            </StyledMaturityContainer> */}

            <StyledTransactionButtonContainer>
                {
                    !hasOpened ? 
                        !stakingObj.isActive || moment().isAfter(endPeriod) ?
                        <span className="closed">Closed</span>
                    :
                        `${startPeriod.format('ll')} - ${startPeriod.format('LT')}` 
                    : 
                        <StyledStakeButton onClick={() => {
                            //@ts-ignore
                            return clickFunction(stakingObj.address)
                        }}>Start Staking</StyledStakeButton>
                }
            </StyledTransactionButtonContainer>
        </StyledStakingListContainer>
    )
};