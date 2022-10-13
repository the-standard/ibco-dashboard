/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import styled from 'styled-components';
import media from '../../../styles/media';

export const StyledMainContainer = styled.main`
    margin: 0 auto;
    width: 100%;

    ${media.desktop`
        width: 46%;
    `}
`;