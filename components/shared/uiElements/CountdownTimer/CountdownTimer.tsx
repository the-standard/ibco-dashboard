/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from "react";
import { StyledCountdownContainer, StyledMainContainer, StyledTimerElem } from "./styles";

const CountdownTimer = () => {
    const calculateTimeLeft = () => {
        const difference = +new Date(`2022-11-28T14:00:00`) - +new Date();
        let timeLeft = {};
    
        if (difference > 0) {
          timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          };
        }
    
        return timeLeft;
      };
    
      const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    
      useEffect(() => {
        setTimeout(() => {
          setTimeLeft(calculateTimeLeft());
        }, 1000);
      });
    
      const timerComponents: JSX.Element[] | null | undefined = [];
    
      Object.keys(timeLeft).forEach((interval) => {
        //@ts-ignore
        if (!timeLeft[interval]) {
          return;
        }
    
        timerComponents.push(
          <StyledTimerElem className={interval}>
            {//@ts-ignore
                timeLeft[interval]
            }<br /><span>{interval}</span>
          </StyledTimerElem>
        );
      });

    return(
        <StyledMainContainer>
            <h1>Standard Euro (sEURO) Minting Event</h1>
            <StyledCountdownContainer>
                {
                    timerComponents.length ? timerComponents : <span>sEURO Bonding, Staking and Swapping is now available!</span>
                }
            </StyledCountdownContainer>
        </StyledMainContainer>
       
    )
}

export default CountdownTimer;