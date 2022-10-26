import React from "react";
import { StyledFooterNavContainer } from "./uiElements/styles/FooterLinksStyles";

export const FooterLinks = () => {
    return (
        <StyledFooterNavContainer>
            <a href="https://www.thestandard.io/" rel="noreferrer" target="_blank">The Standard Protocol</a>
            <a href="https://www.thestandard.io/ecosystem" rel="noreferrer" target="_blank">Ecosystem</a>
            <a href="https://www.thestandard.io/careers" rel="noreferrer" target="_blank">Careers</a>
            <a href="https://www.thestandard.io/faq" rel="noreferrer" target="_blank">FAQ</a>
            <a href="Whitepaper" rel="noreferrer" target="_blank">Whitepaper</a>
            <a href="Blog" rel="noreferrer" target="_blank">Blog</a>
        </StyledFooterNavContainer>
    )
};