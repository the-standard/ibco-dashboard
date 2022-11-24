/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import styled from "styled-components";
import media from "../../../../styles/media";

export const StyledGlobalContainer = styled.div`
    width: 90%;
    margin: 0 auto;
    
    ${media.desktop`
        width: 80%;
        
    `}
`;

export const StyledPushFooter = styled.div`
    display: flex;
    min-height: 80vh;
    flex-direction: column;
    justify-content: space-between;
`;

export const StyledGlobalBetaBanner = styled.div`
    font-size: 1em;
    font-weight: bold;
    margin: 0 auto 1em;
    padding: 0.5em 1em;
    text-align: center;
    color: ${props => props.theme.colors.black};
    background-color: ${props => props.theme.colors.cyan};

    & a {
        color: ${props => props.theme.colors.black}
    }
`;