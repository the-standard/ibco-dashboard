/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import styled from "styled-components";
import media from "../../../../styles/media";

export const StyledFooterNavContainer = styled.div`
    max-width: 660px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 13px;
    margin: 0 auto;

    & a {
        color: ${props => props.theme.colors.white};
        text-decoration: none;
    }

    ${media.desktop`
        font-size: 14px;
        flex-direction: row;
    `}
`;

export const StyledFooterNavContainerMain = styled.footer`
`;

export const StyledFooterSocialContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 1.5em auto;
    max-width: 14%;
    display: flex;

    & a {
        color: ${props => props.theme.colors.white};
        text-decoration: none;
        font-size: 20px;
    }
`;

export const StyledBuildIdContainer = styled.p`
    text-align: center;
    font-size: 0.8em;
    color: ${props => props.theme.colors.borderLightGrey};
`;
