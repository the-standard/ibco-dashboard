import styled from "styled-components";

export const StyledButton = styled.button`
    padding: 10px 5px;
    background: none;
    border: 1px solid #727272;
    border-radius: 2px;
    min-width: 82px;

    &.selected {
        border: 1px solid #99f9ff;
        background-color: #074E53;
    }
`;

export const StyledRateLengthP = styled.p`
    font-size: 14px;
    font-weight: bold;
    color: #fff;
`;

export const StyledROIP = styled.p`
    font-size: 17px;
    font-weight: normal;
    color: #99f9ff;
    margin-top: 10px;
`;