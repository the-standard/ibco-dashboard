import styled from 'styled-components';

export const StyledDescriptionContainer = styled.div`
    background-color: ${props => props.theme.colors.darkGrey};
`;

export const StyledDescriptionParagraph = styled.p`
    color: ${props => props.theme.colors.white};
    font-size: 16px;
    text-align: justify;
    text-justify: inter-word;
    padding: 1.5em 3em;
    text-align: justified;
    margin: 16px 0 8px;
`;