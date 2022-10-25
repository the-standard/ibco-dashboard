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

export const StyledStakingHistoryContainer = styled.div`
    h2 {
        background: #272727;
        padding: 0.8em 1em;
        text-align: center; 
    }
    
    ${media.desktop`
        h2 {
            font-size: 16px;
            font-weight: normal;
            margin-top: 40px;
            margin-bottom: 16px;
            background: none;
            padding: 0;
            text-align: left;
            text-align: left;
        }
    `}
`;

export const StyledGridHeaders = styled.div`
    display: flex;
    margin: 1em;
    
    ${media.desktop`
        & > span {
           flex: 1;
        }
    `}
`;
