/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import styled from "styled-components";
import media from "../../../../styles/media";

export const StyledWeb3ButtonContainer = styled.div`
    position: absolute;
    display: flex;
    justify-content: space-between;
    background-color: ${props => props.theme.colors.grey};
    border: 0.1em solid ${props => props.theme.colors.lighterGrey};
    padding: 1em;
    margin-top: 3em;
    width: 81.5vw;
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
    margin: 0 0.5em;
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
    font-size: 1em;
    font-weight: bold;

    ${media.desktop`
        background-color: ${props => props.theme.colors.red};
        color: #fff;
    `}
`;