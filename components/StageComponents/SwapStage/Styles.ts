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
        margin-right: 1em;
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
    padding: 1em;

    & h2 {
        color: ${props => props.theme.colors.cyan};
        margin-top: 0;
    }

    ${media.desktop`
        display: flex;
        justify-content: space-between;

        & h2 {
            padding: 0;
            margin: 0;
        }

        & .copyButton {
            cursor: pointer;
            color: ${props => props.theme.colors.cyan};
            width: 10%;
            margin-top: 0.4em;
        }
    `}
`;

export const StyledAddressHolderP = styled.p`
    overflow-wrap: anywhere;

    ${media.desktop`
        margin: 0.4em 0 0 0;
        padding: 0;
    `}
`;

export const StyledCopyButton = styled.button`
    width: 100%;
    font-size: 1em;
    padding: 1em 0;
`;

export const StyledTokenInformationContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    background-color: ${props => props.theme.colors.darkGrey};
    padding: 1em;
    margin: 1em 0;

    & > div {
        min-width: 50%;
        font-size: 1.1em;
    }

    & h2 {
        font-size: 1.1em;
        margin: 0;
    }

    & p {
        margin-top: 0.4em;
    }

    & h2,
    & > div > h2 {
        margin-top: 0;
        color: ${props => props.theme.colors.cyan};
        font-weight: normal;
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
    padding 1em;
    background-color: ${props => props.theme.colors.darkGrey};
    margin: 1em 0;

    ${media.desktop`
        margin: 0;
    `}
`;

export const StyledPContainer = styled.p`
    padding: 0;
    margin: 0 0 0.5em 0;
`;

export const StyledInputContainers = styled.div`
    display: flex;
    width: 100%;
    margin: 0.1em 0 0.8em 0;

    & input {
        color: ${props => props.theme.colors.white};
        font-size: 1em;
        min-width: 53%;
    }

    & .dropdownSelect {
        font-size: 0.8em;
    }

    & select.dropdownSelect {
        min-width: 40%;
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