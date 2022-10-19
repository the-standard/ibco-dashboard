/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import styled from 'styled-components';
import media from '../../../styles/media';

export const StyledMainContainer = styled.main`
    margin: 0 auto;
    width: 100%;

    ${media.desktop`
        width: 65%;
    `}
`;

export const StyledBondingInterfaceContainer = styled.div`
    background-color: ${props => props.theme.colors.darkGrey};
    padding: 2.5em 3.5em;

    ${media.desktop`
        position: relative;
        top: -5px;
    `}
`;

export const StyledBondingHistoryButtonContainer = styled.div`
    text-align: center;
    background-color: ${props => props.theme.colors.darkGrey};
    margin-bottom: 1em;

    ${media.desktop`
        position: relative;
        top: -1em;
        padding-bottom: 1em;
        margin-bottom: 0;
    `}
`;

export const StyledBondingHistoryButton = styled.button`
    padding: 0.5em 3em;
    font-size: 1em;
    margin-bottom: 3em;
    cursor: pointer;
    background: none;
    border: 0.1em solid ${props => props.theme.colors.cyan};
    color: ${props => props.theme.colors.cyan};

    ${media.desktop`
        margin-bottom: 0;
    `}
`;

export const StyledPContainer = styled.p`
    padding: 0;
    margin: 0 0 0.5em 0;
`;

export const StyledNoFormatP = styled.p`
    padding: 0;
    margin: 0 1.5em;
`;

export const StyledInputContainers = styled.div`
    display: flex;
    width: 100%;
    margin: 0.1em 0 2em 0;

    & input {
        color: ${props => props.theme.colors.white};
        font-size: 1em;
        width: 100%;
    }

    & .dropdownSelect {
        width: 81px;
        ma
        font-size: 16px;
    }

    & select.dropdownSelect {
        width: 81px;
    }
`;

export const StyledRateSelectionContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const StyledTransactionButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 4em 0 8px 0;
`;

export const StyledTransactionButton = styled.button`
    width: 100%;
    margin: 0 4px 0 0;
    font-size: 14px;
    padding: 1em;
    border: 0;

    &.halfWidth {
        width: 50%;
    }

    &.noRightMargin {
        margin-right: 0;
        margin-left: 4px;
    }

    &.extraMarginTop {
        margin-top: 2em;
    }

    &.marginTop {
        margin-top: 8px;
    }
`;