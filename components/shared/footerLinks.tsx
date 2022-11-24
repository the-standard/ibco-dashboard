import React from "react";
import { StyledFooterNavContainer } from "./uiElements/styles/FooterLinksStyles";

export const FooterLinks = () => {
    return (
        <StyledFooterNavContainer>
            <a href="https://www.thestandard.io/faq" rel="noreferrer" target="_blank">FAQ</a>
            <a href="https://www.thestandard.io/whitepaper" rel="noreferrer" target="_blank">Whitepaper</a>
            <a href="https://blog.thestandard.io" rel="noreferrer" target="_blank">Blog</a>
            <a href="https://docs.ibco-general.thestandard.io/" rel="noreferrer" target="_blank">General Docs</a>
            <a href="https://docs.ibco-technical.thestandard.io/" rel="noreferrer" target="_blank">Technical Docs</a>
            <a href="https://discord.gg/THWyBQ4RzQ" rel="noreferrer" target="_blank">Support</a>
        </StyledFooterNavContainer>
    )
};
