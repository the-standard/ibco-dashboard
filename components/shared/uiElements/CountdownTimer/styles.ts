import styled from "styled-components";

export const StyledMainContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-top: 10%;
    align-content: center;
`;

export const StyledCountdownContainer = styled.div`
    display: flex;
    width: 60%;
    justify-content: center;
    border-radius: 4px;
    box-shadow: 0 2px 4px ${props => props.theme.colors.black};
    padding 2em 1.5em;
    background-color: ${props => props.theme.colors.darkGrey};
    border: 1px solid ${props => props.theme.colors.white};
    margin: 0 auto;
`;

export const StyledTimerElem = styled.div`
    font-size: 24px;
    color: ${props => props.theme.colors.cyan};
    font-weight: bold;
    margin-right: 50px;
    text-align: center;
    line-height: 30px;

    &:last-child {
        margin: 0;
    }

    & span {
        font-size: 18px;
    }
`;