/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Twitter, Youtube, Linkedin, Instagram} from 'react-feather';
import { FooterLinks } from './footerLinks';
import { isMobile } from "react-device-detect";
import { useEffect, useState } from 'react';
import { StyledBuildIdContainer, StyledFooterNavContainerMain, StyledFooterSocialContainer } from './uiElements/styles/FooterLinksStyles';

const Footer = () => {
    const [mobile, setMobile] = useState();
    
    useEffect(() => {
      //@ts-ignore
      setMobile(isMobile)
    }, [setMobile]);


    return (
        <StyledFooterNavContainerMain>
            <StyledFooterSocialContainer>
                <a href="https://twitter.com/thestandard_io" rel="noreferrer" target="_blank"><Twitter width={20} height={20} /></a>
                <a href="https://www.youtube.com/thestandard_io" rel="noreferrer" target="_blank"><Youtube width={20} height={20} /></a>
                <a href="https://www.linkedin.com/company/the-standard-io" rel="noreferrer" target="_blank"><Linkedin width={20} height={20} /></a>
                <a href="https://www.instagram.com/thestandard.io/" rel="noreferrer" target="_blank"><Instagram width={20} height={20} /></a>
            </StyledFooterSocialContainer>
            {!mobile && <FooterLinks />}
            <StyledBuildIdContainer>BUILD ID: {process.env.NEXT_PUBLIC_GIT_COMMIT_SHA?.slice(0, 7)}</StyledBuildIdContainer>
        </StyledFooterNavContainerMain>
    )
}

export default Footer