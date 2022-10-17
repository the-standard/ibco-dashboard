/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import styled from 'styled-components';
import media from '../../../styles/media';

export const StyledMainContainer = styled.main`
    margin: 0 auto;
    width: 100%;

    ${media.desktop`
        width: 46%;
    `}
`;

export const StyledBondingHistoryButtonContainer = styled.div`
    text-align: center;
`;

export const StyledBondingHistoryButton = styled.button`
    padding: 0.5em 3em;
    font-size: 1em;
    margin-bottom: 3em;
    cursor: pointer;
    background: none;
    border: 0.1em solid ${props => props.theme.colors.cyan};
    color: ${props => props.theme.colors.cyan};
`;

export const StyledPContainer = styled.p`
    padding: 0;
    margin: 0 0 0.5em 0;
`;

export const StyledNoFormatP = styled.p`
    padding: 0;
    margin: 0 auto;
`;

export const StyledInputContainers = styled.div`
    display: flex;
    width: 100%;
    margin: 0.1em 0 0.8em 0;

    & input {
        color: ${props => props.theme.colors.white};
        font-size: 1em;
        min-width: 70%;
    }
`;

export const StyledRateSelectionContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const StyledTransactionButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 2em 0;
`;

export const StyledTransactionButton = styled.button`
    width: 100%;
    margin: 0 auto;
    font-size: 0.9em;
    padding: 1em;
    border: 0;

    &.halfWidth {
        width: 48%;
    }

    &.extraMarginTop {
        margin-top: 2em;
    }
`;