/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import styled from 'styled-components';
import media from '../../../../styles/media';

export const StyledSubNavContainer = styled.nav`
    display: flex;
    margin: 1.2em auto 2em;
    width: 100%;
    justify-content: space-between;
    text-align: center;

    & a {
        max-width: 48%;
        text-decoration: none;
        color: ${props => props.theme.colors.superLightGrey};
        border: 0.1em solid ${props => props.theme.colors.grey};
        background-color: ${props => props.theme.colors.grey};
        padding: 0.4em 0.8em;
        cursor: pointer;

        &.active {
            color: ${props => props.theme.colors.cyan};
            border: 0.1em solid ${props => props.theme.colors.cyan};
            background-color: ${props => props.theme.colors.darkGreen} 
        }
    }

    ${media.desktop`
        width:45%;
        margin: 1.2em auto 4em;

        & a {
            border: 0;
            background: none;

            &.active {
                border: 0;
                white-space: nowrap;
                background: none;
            }
        }
    `}
`;

export const StyledSubNav = styled.a`
    &.subnav {
        text-decoration: none;
        color: #616161;
        font-size: 14px;

        &.active {
            font-weight: bold;
            color: #99f9ff;
        }
    }
`;

export const StyledSubNavIndicatorContainer = styled.div`
    display: flex;
    width: 74%;
    margin: 0 auto;
    justify-content: space-between;
    border-bottom: 0.1em solid ${props => props.theme.colors.superLightGrey};

    ${media.desktop`
        width:40%;
        position: relative;
        top: 4em;
    `}
`;

export const StyledSubNavIndicatorOuterPip = styled.div`
    display: flex;
    flex-direction: column; /* make main-axis vertical */
    justify-content: center; /* align items vertically, in this case */
    align-items: center; /* align items horizontally, in this case */
    width: 1.2em;
    height: 1.2em;
    border-radius: 0.7em;
    border: 0.1em solid ${props => props.theme.colors.superLightGrey};
    position: relative;
    bottom: -0.77em;

    &.activePip {
        border-color: ${props => props.theme.colors.cyan};
    }
`;

export const StyledSubNavIndicatorInnerPip = styled.div`
    width: 0.7em;
    height: 0.7em;
    background-color: ${props => props.theme.colors.superLightGrey};
    border-radius: 0.4em;

    &.activePip {
        background-color: ${props => props.theme.colors.cyan};
    }
`;