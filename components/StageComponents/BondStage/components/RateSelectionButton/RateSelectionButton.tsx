/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { StyledButton, StyledRateLengthP, StyledROIP } from './Styles';

type RateType = {
    duration: string, 
    rate: string
  }

type RateSelectionButtonType = {
    rate: RateType,
    isSelected: boolean,
    clickHandler: React.MouseEventHandler<object>,
}

export const RateSelectionButton = ({rate, isSelected, clickHandler}:RateSelectionButtonType) => {
    const week2year = (rate:string) => {
        const _rate = parseInt(rate);
        const weekPerYear = 52;

        return Math.floor(_rate/weekPerYear)
    }

    const WeekCalc = week2year(rate.duration);

    const rateLength = WeekCalc < 1 ? `${rate.duration} ${parseInt(rate.duration) === 1 ? 'week' : 'weeks'}` : `${WeekCalc} ${WeekCalc === 1 ? 'year' : 'years'}`
    return (
        //@ts-ignore
        <StyledButton className={isSelected ? 'selected' : ''} onClick={() => clickHandler(rate)}>
            <StyledRateLengthP>{rateLength}</StyledRateLengthP>
            <StyledROIP>+{parseInt(rate.rate) / 1000}%</StyledROIP>
        </StyledButton>
    )
};