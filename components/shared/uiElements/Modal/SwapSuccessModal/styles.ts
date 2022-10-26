import styled from "styled-components";

export const StyledModalPositionContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.8);
    z-index: 100;
    backdrop-filter: blur(2px);
`;

export const StyledModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    max-width: 650px;
    font-size: 18px;
    text-align: center;
    color: ${props => props.theme.colors.white};
    background-color: ${props => props.theme.colors.darkGrey};
    padding: 2em 4.5em;

    & h1 {
        font-weight: bold;
        font-size: 29px;
        text-align: center;
        color: ${props => props.theme.colors.cyan};
        padding: 0;
    }

    & p {
        margin-top: 0;
    }

    & button.goToButton {
        margin: 1.5em auto;
        padding: 0.8em 0;
        cursor: pointer;
        width: 46%;
    }
`;

export const StyledTokenAmount = styled.p`
    font-size: 18px;

    & span {
        font-size: 20px;
        font-weight: bold;
        color: ${props => props.theme.colors.cyan};
    }
    
    & span.tokenSymbol {
        color: ${props => props.theme.colors.white};
    }
`;

export const StyledBondingButton = styled.button`
    border: 0;
    background-color: ${props => props.theme.colors.cyan};
    padding: 0.5em 1.5em;
    font-size: 14px;
    color: ${props => props.theme.colors.black};
`;

export const StyledCloseButton = styled.button`
    position: absolute;
    top: 0.5em;
    right: 0.5em;
    background: none;
    width: auto;
    padding: 0;
    margin: 0;
    border: 0;
    cursor: pointer;
    color: ${props => props.theme.colors.white};
`;