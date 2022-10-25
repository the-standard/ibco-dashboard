/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import styled from "styled-components";
import media from "../../../../../styles/media";

export const StyledBondHistoryItemContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    border:0.1em solid ${props => props.theme.colors.borderLightGrey};
    border-radius: 0.2em;
    margin-bottom: 8px;
    width: 100%;
    background-color: ${props => props.theme.colors.darkGrey};
    font-size: 16px;

    & p {
        margin: 0 0 0.5em 1em;
        padding: 0;
    }

    ${media.desktop`
        border: 0;
        background: none;
        flex-direction: row;
        
        & > div, & > p {
            flex: 1;
            padding: 1em;
            margin: 0;
            text-align: left;
            background-color: ${props => props.theme.colors.darkGrey};
        }
    `}
`;

export const StyledTangoContainer = styled.div`
    max-width: 150px;
`;

export const StyledProfitContainer = styled.div`
    position: absolute;
    right: 1em;
    top: 4em;
    padding: 0.5em 1em;
    border: 0.1em solid ${props => props.theme.colors.cyan};
    border-radius: 0.2em;
    text-align: center;
    max-width: 30px;

    & p.amount {
        padding: 0;
        margin: 0;
        font-weight: bold;
        color: ${props => props.theme.colors.cyan};
    }

    ${media.desktop`
        position: static;
        border: 0;
        margin: 0;
        padding: 0;
    `}
`;

export const StyledP = styled.p`
    color: ${props => props.theme.colors.textGrey};
    padding: 0;
    margin: 0 0 0 1em !important;
    
    ${media.desktop`
        display: none;
    `}
`;

export const StyledProfitTitleP = styled.p`
    color: ${props => props.theme.colors.textGrey};
    padding: 0;
    margin: 0 !important;

    ${media.desktop`
        display: none;
    `}
`;

export const StyledClaimButton = styled.div`
    background ${props => props.theme.colors.black};
    width: 100%;
    order: -1;
    text-align: center;
    padding: 0.5em 0;
    margin-bottom: 0.5em;

    & p {
        margin: 0 !important;
    }

    & a {
        text-decoration: none;
    }

    & .claimed {
        color: ${props => props.theme.colors.textGrey};
    }

    ${media.desktop`
        width: auto;
        order: 0;
    `}
`;
