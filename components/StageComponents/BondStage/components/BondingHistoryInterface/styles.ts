/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import styled from "styled-components";
import media from "../../../../../styles/media";

export const StyledBondHistoryContainer = styled.div`
    display: flex;
    flex-direction: column;

    ${media.desktop`
        flex-direction: row;
        align-items: flex-start;
        margin-top: 2em;
    `}
`;

export const ClaimRewardContainer = styled.div`
    border: 1px solid #fff;
    border-radius: 5px;
    background-color: ${props => props.theme.colors.darkGrey};
    text-align: center;
    order: -1;
    margin-bottom: 1em;
    padding: 1em 2.5em;
    font-size: 16px;

    & p {
        padding: 0;
        margin: 0 0 0.5em 0;
    }

    & button {
        font-size: 14px;
        width: 100%;
        padding: 0.5em 1em;
        border: 0;
        cursor: pointer;
    }

    & .rewardValue {
        font-size: 22px;
    }

    ${media.desktop`
        order: 0;
        width: 20%;
        margin: 0 0 0 18px;
    `}
`;

export const StyledBondGridContainer = styled.div`
    width: 100%;

`;

export const StyledBackButtonContainer = styled.div`
    & a {
        display: flex;
        color: ${props => props.theme.colors.textGrey};
        text-decoration: none;
    }
`;

export const StyledChevronSpan = styled.span``;

export const StyledGridHeaders = styled.div`
    ${media.desktop`
        display: flex;
        flex-direction: row;
        margin-bottom: 1em;

        & > span {
            flex: 1;
            padding: 0 1em;
        }
    `}
`;
