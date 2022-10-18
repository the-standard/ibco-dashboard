import styled from 'styled-components';

export const StyledDescriptionContainer = styled.div`
    background-color: ${props => props.theme.colors.darkGrey};
`;

export const StyledDescriptionParagraph = styled.p`
    color: ${props => props.theme.colors.lightGrey};
    font-size: 1em;
    text-align: justify;
    text-justify: inter-word;
    padding: 1.5em 3em;
    text-align: justified;
`;