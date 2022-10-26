/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import styled from 'styled-components';
import media from '../../../styles/media';

export const StyledContainer = styled.div`
    width: 90%;
    
    ${media.desktop`
        width: 80%;
    `}
`;

export const StyledLeftRightColContainer = styled.div`
    ${media.desktop`
        display: flex;
        width: 100%;
    `}
`;

export const StyledTokenInfoLeftCol =styled.div`
    ${media.desktop`
        margin-right: 8px;
        width: 75%;
    `}
`;

export const StyledTokenInfoRightCol =styled.div`
    ${media.desktop`
        width: 25%;
    `}
`;

export const StyledSupplyContainer = styled.div`
    background-color: ${props => props.theme.colors.darkGrey};
    padding: 1em 1.5em;

    & h2 {
        font-size: 16px;
        color: ${props => props.theme.colors.cyan};
    }

    ${media.desktop`
        display: flex;

        & h2 {
            padding: 0;
            margin: 0 0.5em 0 0;
        }

        &.extraMarginBottom {
            margin-bottom: 3em;
        }
    `}
`;

export const StyledAddressHolderP = styled.p`
    overflow-wrap: anywhere;

    ${media.desktop`
        margin: 0.2em 0 0 0;
        padding: 0;
    `}
`;

export const StyledCopyButton = styled.button`
    width: 100%;
    font-size: 1em;
    padding: 1em 0;
`;

export const StyledDesktopCopyButton = styled.a`
    ${media.desktop`
        margin: 0.2em 0 0 0;
        color: ${props => props.theme.colors.cyan};
        text-decoration: none;
        width: auto;
        margin-left: auto;
        cursor: pointer;
    `}
`;

export const StyledTokenInformationContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    background-color: ${props => props.theme.colors.darkGrey};
    padding: 1em 1.5em;
    margin: 8px 0;
    font-size: 16px;

    & > div {
        min-width: 50%;
        font-size: 1.1em;
    }

    & h2 {
        font-size: 16px;
        font-weight: bold;
        margin: 0;
    }

    & p {
        font-size: 16px;
        margin-top: 0.4em;
        margin-bottom: 0;
    }

    & h2,
    & > div > h2 {
        margin-top: 0;
        color: ${props => props.theme.colors.cyan};
        line-height: normal;
    }

    ${media.desktop`
        flex-wrap: nowrap;
        justify-content: space-between;
        & > div {
            min-width: auto;
        }
    `}
`;

export const StyledSwapInterfaceContainer = styled.div`
    padding 2em 1.5em;
    background-color: ${props => props.theme.colors.darkGrey};
    margin: 1em 0;
    font-size: 14px;

    ${media.desktop`
        margin: 0;
    `}
`;

export const StyledPContainer = styled.p`
    padding: 0;
    font-size: 14px;
    margin: 0 0 0.5em 0;
`;

export const StyledInputContainers = styled.div`
    display: flex;
    width: 100%;
    margin: 0.1em 0 1.5em 0;

    & input {
        color: ${props => props.theme.colors.white};
        font-size: 1em;
        width: 100%;
    }

    & div.dropdownSelect {
        width: 100px;
        font-size: 14px;
        padding: 0;
        margin: 0;
    }

    & select.dropdownSelect {
        width: auto;
        min-width: 76px;
        font-size: 14px;
        padding: 0;
        margin: 0;
    }
`;

export const StyledSwapButton = styled.button`
    width: 100%;
    font-size: 0.9em;
    padding: 1em;
    margin-top: 1em;
    cursor: pointer;
    border: 0;

    &.extraMarginTop {
        margin-top: 2em;
    }
`;

export const StyledBondingCurveContainer = styled.div`
    font-size: 16px;
    padding 2em 1.5em;
    background-color: ${props => props.theme.colors.darkGrey};
`;
