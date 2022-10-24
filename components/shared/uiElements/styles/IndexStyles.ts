/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import styled from "styled-components";
import media from "../../../../styles/media";

export const StyledIndexContainer = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%
`;

export const StyledIndexDescriptionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 6em;

    p {
        padding-top: 0;
        padding-bottom: 12px;
        margin-top: 0;
    }

    ${media.desktop`
        margin-top: 12em;
    `}
`;

export const StyledTokenInformationContainer = styled.div`
    margin-top: 3em;
`;