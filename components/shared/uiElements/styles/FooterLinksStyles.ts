/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import styled from "styled-components";
import media from "../../../../styles/media";

export const StyledFooterNavContainer = styled.div`
    ${media.desktop`
        width: 54%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;

        & a {
            color: ${props => props.theme.colors.white};
            text-decoration: none;
        }
    `}
`;

export const StyledFooterNavContainerMain = styled.footer`
`;

export const StyledFooterSocialContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    margin: 2em 0;

    & a {
        color: ${props => props.theme.colors.white};
    }

    ${media.desktop`
        width: 54%;
        margin: 4em auto;
    `}
    
`;

export const StyledBuildIdContainer = styled.p`
    text-align: center;
`;