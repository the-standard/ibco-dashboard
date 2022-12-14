/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FaDiscord, FaInstagramSquare, FaTelegramPlane, FaGithub } from 'react-icons/fa';
import { FooterLinks } from './footerLinks';
import { useEffect, useState } from 'react';
import { StyledBuildIdContainer, StyledFooterNavContainerMain, StyledFooterSocialContainer } from './uiElements/styles/FooterLinksStyles';
import { CurrentBreakpoint } from '../../hooks/BreakpointObserver';

const Footer = () => {
    const [mobile, setMobile] = useState();
    const breakpoint = CurrentBreakpoint();

    useEffect(() => {
      //@ts-ignore
      setMobile(breakpoint !== 'desktop');
    }, [setMobile, breakpoint]);


    return (
        <StyledFooterNavContainerMain>
            <StyledFooterSocialContainer>
                <a href="https://www.instagram.com/thestandard.io/" rel="noreferrer" target="_blank"><FaInstagramSquare /></a>
                <a href="https://discord.gg/THWyBQ4RzQ" rel="noreferrer" target="_blank"><FaDiscord /></a>
                <a href="https://t.me/TheStandard_io" rel="noreferrer" target="_blank"><FaTelegramPlane /></a>
                <a href="https://github.com/the-standard/ibco-dashboard" rel="noreferrer" target="_blank"><FaGithub /></a>
            </StyledFooterSocialContainer>
            {!mobile && <FooterLinks />}
            <StyledBuildIdContainer>BUILD ID: {process.env.NEXT_PUBLIC_GIT_COMMIT_SHA?.slice(0, 7)}</StyledBuildIdContainer>
        </StyledFooterNavContainerMain>
    )
}

export default Footer