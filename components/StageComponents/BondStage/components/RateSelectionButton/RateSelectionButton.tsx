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
    const timeCorruptionAgent = () => {
        const _rate = parseInt(rate.duration.toString());
        const seconds2minutes = Math.floor(_rate/60);
        const minutes2hours = Math.floor(seconds2minutes/60);
        const hours2days = Math.floor(minutes2hours/24);
        const days2weeks = Math.floor(hours2days/7);
        const weeks2Months = Math.floor(days2weeks/4.3);
        const months2Years = Math.floor(weeks2Months/52);
        
        const value = months2Years > 0 ? months2Years : weeks2Months > 0 ? weeks2Months : days2weeks > 0 ? days2weeks : hours2days > 0 ? hours2days : minutes2hours > 0 ? minutes2hours : seconds2minutes;
        const time = months2Years > 0 ? (months2Years > 1 ? 'years' : 'year') : weeks2Months > 0 ? (weeks2Months > 1 ? 'months' : 'month') : days2weeks > 0 ? (days2weeks > 1 ? 'weeks' : 'week') : hours2days > 0 ? (hours2days > 1 ? 'days' : 'day') : minutes2hours > 0 ? (minutes2hours > 1 ? 'hours' : 'hour') : seconds2minutes > 1 ? 'minutes' : 'minutes';

        return {value: value, time: time}
    }

    const timeCalc = timeCorruptionAgent();
    return (
        //@ts-ignore
        <StyledButton className={isSelected ? 'selected' : ''} onClick={() => clickHandler(rate)}>
            <StyledRateLengthP>{timeCalc.value} {timeCalc.time}</StyledRateLengthP>
            <StyledROIP>+{parseInt(rate.rate) / 1000}%</StyledROIP>
        </StyledButton>
    )
};