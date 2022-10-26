/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { TOKENS } from "../../../../../Utils";
import { X } from 'react-feather';
import ReactCanvasConfetti from "react-canvas-confetti";
import { StyledModalContainer, StyledModalPositionContainer, StyledTokenAmount, StyledCloseButton, StyledBondingButton } from "./styles";

type SwapModal = {
    seuroAmount: string,
    modalCloseClick: React.MouseEventHandler,
}

const canvasStyles = {
    position: "fixed",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 101,
  };
  //@ts-ignore
  function getAnimationSettings(angle, originX) {
    return {
      particleCount: 3,
      angle,
      spread: 55,
      origin: { x: originX },
      colors: ["#99f9ff", "#ffffff"]
    };
  }

    const SwapSuccessModal = ({seuroAmount, modalCloseClick}:SwapModal) => {
        const refAnimationInstance = useRef(null);
    const [intervalId, setIntervalId] = useState();
//@ts-ignore
    const getInstance = useCallback((instance) => {
        refAnimationInstance.current = instance;
    }, []);

    const nextTickAnimation = useCallback(() => {
        if (refAnimationInstance.current) {
            //@ts-ignore
        refAnimationInstance.current(getAnimationSettings(60, 0));
        //@ts-ignore
        refAnimationInstance.current(getAnimationSettings(120, 1));
        }
    }, []);

    const startAnimation = useCallback(() => {
        if (!intervalId) {
            //@ts-ignore
        setIntervalId(setInterval(nextTickAnimation, 16));
        }
    }, [nextTickAnimation, intervalId]);

    const stopAnimation = useCallback(() => {
        clearInterval(intervalId);
        //@ts-ignore
        setIntervalId(null);
        //@ts-ignore
        refAnimationInstance.current && refAnimationInstance.current.reset();
    }, [intervalId]);

    useEffect(() => {
        startAnimation();
    }, [])

    useEffect(() => {
        return () => {
        clearInterval(intervalId);
        };
    }, [intervalId]);

    const modalCloseClickHandler = () => {
        stopAnimation();
        //@ts-ignore
        modalCloseClick();
    }
  
    return (
        <>
            {
                //@ts-ignore
            <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
            }
            <StyledModalPositionContainer>
                <StyledModalContainer>
                    <StyledCloseButton onClick={modalCloseClickHandler}><X size={20} /></StyledCloseButton>
                    <h1>Congratulations!</h1>

                    <p>Thank you for being part of the stablecoin revolution.</p>
                    <StyledTokenAmount>You have now recieved <span>{seuroAmount} <span className="tokenSymbol">{TOKENS.DISPLAY.SEURO}</span></span></StyledTokenAmount>

                    <StyledBondingButton className="goToButton" onClick={() => {window.location.href = '/stage2'}}>Go to bonding page</StyledBondingButton>
                </StyledModalContainer>
            </StyledModalPositionContainer>
        </>
    )
};

export default SwapSuccessModal;