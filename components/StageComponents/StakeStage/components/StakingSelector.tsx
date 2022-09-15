/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import moment from 'moment';

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
    const maturity = moment(parseInt(stakingObj.maturity)*1000)

    const [duration, setDuration] = useState(0);
    const [hasOpened, setHasOpened] = useState(false);
    
    useEffect(() => {
        setDuration(endPeriod.diff(startPeriod, 'weeks'));
        setHasOpened(moment().isSameOrBefore(endPeriod) && moment().isSameOrAfter(startPeriod));
    }, [moment, stakingObj])

    return (
        <div className="w-full px-4 py-2 convertInput grid grid-cols-5 gap-1 mb-4">
            <div>{ `${duration} ${duration > 1 ? 'weeks' : 'week'}` }</div>
            <div>{`+${parseInt(stakingObj.interestRate) / 1000}%`}</div>
            <div>{!hasOpened ? moment().isAfter(endPeriod) ? <span className="closed">Closed</span> : <span className="openSoon">Opening Soon</span>: <span className="openNow">Open Now</span>}</div>
            <div className="greyText">{maturity.format('ll')}</div>
            <div>{
                !hasOpened ? 
                    !stakingObj.isActive || moment().isAfter(endPeriod) ?
                    <span className="closed">Closed</span>
                :
                    `${startPeriod.format('ll')} - ${startPeriod.format('LT')}` 
                : 
                    <button className="px-4 py-2 w-full" onClick={() => {
                        //@ts-ignore
                        return clickFunction(stakingObj.address)
                    }}>Start Staking</button>
            }</div>
        </div>
    )
};