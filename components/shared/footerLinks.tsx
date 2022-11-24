import React from "react";
import { StyledFooterNavContainer } from "./uiElements/styles/FooterLinksStyles";

export const FooterLinks = () => {
    return (
        <StyledFooterNavContainer>
            <a href="https://www.thestandard.io/" rel="noreferrer" target="_blank">The Standard Protocol</a>
            <a href="https://www.thestandard.io/ecosystem" rel="noreferrer" target="_blank">Ecosystem</a>
            <a href="https://www.thestandard.io/careers" rel="noreferrer" target="_blank">Careers</a>
            <a href="https://www.thestandard.io/faq" rel="noreferrer" target="_blank">FAQ</a>
            <a href="https://www.thestandard.io/whitepaper" rel="noreferrer" target="_blank">Whitepaper</a>
            <a href="https://blog.thestandard.io" rel="noreferrer" target="_blank">Blog</a>
            <a href="https://app.gitbook.com/o/XzmVI0dw0DD34ihkKq80/home" rel="noreferrer" target="_blank">Documentation</a>
        </StyledFooterNavContainer>
    )
};