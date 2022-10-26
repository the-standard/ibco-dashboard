/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import styled from 'styled-components';
import media from '../../../../styles/media';

export const StyledConnectNavContainer = styled.nav`
    display: flex;
    justify-content: space-between;

    ${media.desktop`
        display: flex;
    `}
`;

export const StyledMobileConnectNavContainer = styled.div`
    position: relative;
    text-align: right;
    margin-top: 0.5em;
    height: 30px;
    width: 30px;

    & a.mobileMenuClickHandler {
        color: ${props => props.theme.colors.white};

        & svg {
            width: 100%;
            height: 100%;
        }
    }
`;

export const StyledMobileLinksContainer = styled.nav`
    margin: 9em auto;
    margin-right: -0.02em;
    width: 90%;
    text-align: left;

    & a {
        color: ${props => props.theme.colors.white};
        display: block;
        margin: 1.5em 0;
        font-size: 1em;
    }
`;

export const StyledMobileConnectNavDropdownContainer = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: ${props => props.theme.colors.black};
    top: 2.5em;
    right: 0;
    z-index: 100;
`;

export const StyledLogoContainer = styled.div`
    max-width: 274px;

        width: 36%;
`;
