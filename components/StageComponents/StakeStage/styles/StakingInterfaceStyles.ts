import styled from "styled-components";

export const StyledP = styled.p`
    margin: 1.5em 0 0.5em 0;
    padding: 0;
`;

export const StyledStakingPeriodP = styled.p`
    color: ${props => props.theme.colors.cyan};
    font-weight: bold;
    font-size: 1.3em;
    margin: 0 0 1em 0;
`;

export const StyledStakingContainer = styled.div``;

export const StyledStakingInterfaceContainer = styled.div`
    padding: 1em;
    background: ${props => props.theme.colors.backgroundGreyLight};
`;

export const StyledBackButtonContainer = styled.div`
    
`;

export const StyledBackButton = styled.a`
    display: flex;
    color: #6c6c6c;
    font-size: 0.9em;
    text-decoration: none;
`;

export const StyledStakingPeriodInfo = styled.div`
    & .text-sm {
        margin-bottom: 0.5em;
        font-size: 1em;
    }
`;

export const StyledInputContainer = styled.div`
    display: flex;
`;

export const StyledInput = styled.input`
    width: 100%;
    font-size: 1em;
    color: ${props => props.theme.colors.white};
`;

export const StyledDropdownContainer = styled.div`
    width: 81px !important;
    font-size: 1em;

    & p {
        margin: 0;
        padding: 0;
    }
`;

export const StyledButton = styled.button`
    width: 100%;
    padding: 0.7em 1em;
    margin-top: 1em;
    font-size: 1em;
    border: 0;
`;

export const StyledWarning = styled.div`
    display: flex;
    color: ${props => props.theme.colors.yellow};
    font-size: 0.8em;
    line-height: normal;
    font-weight: light;
    margin-top: 1em;
`;

export const StyledWarningIconSpan = styled.span`
    margin-top: 1.5em;
`;

export const StyledWarningP = styled.p`
    width: 84%;
    padding-left: 2em;
    color: ${props => props.theme.colors.lighterGrey};
`;