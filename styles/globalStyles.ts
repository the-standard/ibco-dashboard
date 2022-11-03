/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  html {
    position: relative;
    width: 100%;
    min-height: 100%;
    font-family: 'Poppins', sans-serif;
    background-image: linear-gradient(${props => props.theme.colors.darkGrey}, ${props => props.theme.colors.black});
  }

  svg {
    width: 100%;
  }

  a {
    text-decoration: underline;
    color: #99f9ff;
  }

  body {
    width: 100%;
    height: 100%;
    color: white;
    margin: 0 auto;
    font-size: 14px;
    line-height: normal;
  }

  button {
    background: #99f9ff;
    color: #282828;
    border-radius: 3px;
    opacity: 100%;
  }

  input {
    border: 1px solid #99f9ff !important;
    background: none !important;
    background-color: #282828;
    outline: none;
    padding: 0.8em;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='checkbox']:checked {
    background: #99f9ff !important;
    outline: none;
  }

  input[readOnly] {
    border-color: ${props => props.theme.colors.superLightGrey} !important;
    outline: none;
  }

  input:focus {
    outline: none;
  }

  input:disabled {
    
  }

  button:disabled {
    background: #99f9ff;
    color: #282828;
    cursor: not-allowed;
    opacity: 60%;
  }

  .greyText {
    color: #7a7a7a;
  }

  .bondingHistoryButton {
    background: none;
    color: #99f9ff;
    border: 1px solid #99f9ff;
  }

  .disconnectButton {
    background-color: #cb4464;
    color: #fff;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  select {
    padding-right: 0;
    padding-left: 0;
  }

  .dropdownSelect {
    display: flex;
    background: #074e53;
    color: #99f9ff;
    border: 1px solid #99f9ff !important;
    position: relative;
    overflow: hidden;
    padding: 0.5em;
    width: 100%;
    text-align: center;
    align-items: center;
    width: 100%;
    justify-content: center;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;

    &.readOnly {
      border-color: ${props => props.theme.colors.superLightGrey} !important;
      background: ${props => props.theme.colors.superLightGrey};
      color: ${props => props.theme.colors.offWhite};
    }
  }

  select.dropdownSelect {
    border: 0;
    position: relative;
    z-index: 99;
    font-size: 1em;
  }

  select.dropdownSelect:after {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #99f9ff !important;
    position: absolute;
    top: 0;
    right: 0;
    content: '';
    z-index: 98;
  }

  /*
    Toastr messages container
  */

  /*
    --------------------
    progress bar styles
    --------------------
  */

  .circle-wrap {
    margin: 150px auto;
    width: 150px;
    height: 150px;
    background: #000;
    border-radius: 50%;
  }

  .circle-wrap .circle .mask,
  .circle-wrap .circle .fill {
    width: 150px;
    height: 150px;
    position: absolute;
    border-radius: 50%;
  }

  .circle-wrap .circle .mask {
    clip: rect(0px, 150px, 150px, 75px);
  }

  .circle-wrap .inside-circle {
    width: 145px;
    height: 145px;
    border-radius: 50%;
    background: #000;
    text-align: center;
    margin-top: 2px;
    margin-left: 2px;
    color: #99f9ff;
    position: absolute;
    z-index: 100;
    line-height: normal;
  }

  .circle-wrap .inside-circle .timerNumber {
    font-size: 3em;
  }

  .circle-wrap .inside-circle .timerLabel {
    font-size: 1em;
  }

  .mask .fill {
    clip: rect(0px, 75px, 150px, 0px);
    background-color: #99f9ff;
  }

  /*
    Supply container token information
  */

  .openSoon,
  .openNow,
  .closed {
    font-weight: bold;
    font-size: 16px;
    line-height: normal;
  }

  .openSoon {
    color: #ffc658;
  }

  .openNow {
    color: #99f9ff;
  }

  .closed {
    color: #7a7a7a;
  }

  /*
    BETA Banner
  */

  .betaBanner {
    background-color: #99f9ff;
    color: #000;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .betaBanner a {
    color: #000;
  }

  /*
    CONNECT MODAL
  */

  .connectModal {
    background-color: rgba(0, 0, 0, 0.75);
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`
