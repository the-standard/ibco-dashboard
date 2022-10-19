/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import styled from "styled-components";
import media from "../../../../styles/media";

const CommonPadding = `padding: 0 1em;`;

export const StyledStakingListContainer = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    border: 0.1em solid ${props => props.theme.colors.borderLightGrey};
    margin: 0.5em 0;
    background-color: ${props => props.theme.colors.backgroundGreyLight};
    font-size: 17px;

    ${media.desktop`
        border: none;
        background: ${props => props.theme.colors.darkGrey};
        flex-direction: row;
        padding: 0.5em 1em;
        justify-content: center;
        align-items: center;
    `}
`;

export const StyledStakeButton = styled.button`
    width: 100%;
    padding: 0.8em 1em;
    font-size: 14px;
    margin: 1.5em 0 0 0;
    border: 0;

    ${media.desktop`
        flex: 1;
        margin: 0;
    `}
`;

export const StyledStatusContainer = styled.div`
    text-align: center;
    background-color: ${props => props.theme.colors.black};
    padding: 0.5em 0;
    order: -1;

    ${media.desktop`
        flex: 2;
        order: 0;
        text-align: left;
        background: none;
        padding: 0;
    `}
`;

export const StyledDurationContainer = styled.div`
    ${CommonPadding};
    padding-top: 1em;

    ${media.desktop`
        flex: 2;
        padding: 0;
    `}
`;

export const StyledInterestRateContainer = styled.div`
    ${CommonPadding};
    position: absolute;
    right: 1em;
    top: 4em;
    border: 0.1em solid ${props => props.theme.colors.cyan};
    padding: 1em;
    border-radius: 0.2em;
    text-align: center;
    font-weight: bold;
    color: ${props => props.theme.colors.cyan};

    & p {
        margin: 0;
        padding: 0;
    }

    ${media.desktop`
        flex: 1;
        position: static;
        border: none;
        text-align: left;
        padding: 0;
    `}
`;

export const StyledMaturityContainer = styled.div`
    ${CommonPadding};
    color: ${props => props.theme.colors.borderLightGrey};

    ${media.desktop`
        flex: 1;
        padding: 0;
    `}
`;

export const StyledTransactionButtonContainer = styled.div`
    ${CommonPadding};
    padding-bottom: 1em;

    ${media.desktop`
        flex: 1;
        padding: 0;
    `}
`;

export const StyledTitleP = styled.p`
    color: ${props => props.theme.colors.textGrey};
    font-weight: normal;
    margin-top: 0;
    font-size: 1em;

    ${media.desktop`
        display: none;
    `}
`;

export const StyledGridHeaders = styled.div`
    display: flex;
    margin: 3em 1em 1em;

    ${media.desktop`
        margin: 3em 0 0.5em 1.3em;
        & > span {
           flex: 2;
        }

        & > span.flex1 {
            flex: 1;
         }

        &.greyBG {
            padding: 1em;
            margin: 0;
            background: ${props => props.theme.colors.darkGrey};
            border-bottom: 1px solid ${props => props.theme.colors.borderLightGrey};
        }
    `}
`;

export const StyledStakingHistorySelector = styled.div`
        display: flex;
        font-size: 17px;

        & > span {
            flex: 1;
        }

        & .reward {
            font-weight: bold;
            color: ${props => props.theme.colors.cyan};
        }

        ${media.desktop`
            background: ${props => props.theme.colors.darkGrey};
            padding: 0.5em 1em;
            justify-content: center;
            align-items: center;
        `}
`;