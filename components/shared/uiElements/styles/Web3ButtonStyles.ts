/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import styled from "styled-components";
import media from "../../../../styles/media";

export const StyledWeb3ButtonContainer = styled.div`
    position: absolute;
    display: flex;
    justify-content: space-between;
    text-transform: capitalize;
    background-color: ${props => props.theme.colors.grey};
    border: 0.1em solid ${props => props.theme.colors.lighterGrey};
    padding: 1em;
    margin-top: 3em;
    width: auto;
    right: 0;
    font-weight: bold;

    ${media.desktop`
        position: relative;
        width: auto;
        margin: 0;
        padding: 0;
        background: none;
        border: 0;
    `}
`;

export const StyledWalletNetworkContainer = styled.span`
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
`;

export const StyledWalletAddressContainer = styled.span`
    margin: 0 0 0 0.7em;
`;

export const StyledWeb3AddressContainer = styled.div`
    ${media.desktop`
        font-weight: normal;
        background-color: ${props => props.theme.colors.middleGrey};
        padding: 0.5em 1em;
        border-top-left-radius: 0.22em;
        border-bottom-left-radius: 0.22em;
    `}
`;

export const StyledDisconnectButton = styled.button`
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background: none;
    color: ${props => props.theme.colors.red};
    border: 0;
    font-size: 14px;

    ${media.desktop`
        background-color: ${props => props.theme.colors.red};
        color: #fff;
        padding: 0 1em;
    `}
`;

export const StyledMainConnectButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5em 1em;
    margin: 0;
    border: 0;
    border-radius: 0.2em;
    font-size: 1em;

    & > span {
        margin-right: 1em;
        width: 20px;
    }
`;
