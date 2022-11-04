/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from "react";
import { Web3Button } from "../../../components/shared/uiElements/Web3Button";
import { StyledConnectNavContainer, StyledLogoContainer, StyledMobileConnectNavContainer, StyledMobileConnectNavDropdownContainer, StyledMobileLinksContainer } from "./styles/ConnectNavStyles";
import Cookies from 'universal-cookie';
import { FaBars } from 'react-icons/fa';
import { GrClose } from 'react-icons/gr';
import { FooterLinks } from "../footerLinks";
import { CurrentBreakpoint } from "../../../hooks/BreakpointObserver";

const ConnectNav = () => {
    const cookies = new Cookies();
    const [mobile, setMobile] = useState();
    const [terms, setTerms] = useState<boolean>();
    const [openState, setOpenState] = useState(false);
    const breakpoint = CurrentBreakpoint();
    

    useEffect(() => {
      //@ts-ignore
      setMobile(breakpoint !== 'desktop');
    }, [setMobile, breakpoint]);

    useEffect(() => {
      const x = cookies.get('_ibcotv1');
      if (!!x) {
        setTerms(true);
      };
    }, [terms]);

    const mobileOpenClickHandler = () => {
      setOpenState(!openState);
    }

    return (
      <StyledConnectNavContainer>

          <StyledLogoContainer>
            {
              !mobile ?
                <img src='/Images/theStandardLogo.svg' alt='The Standard' width='100%' />
              :
                <img src='/Images/StandardLogo-Icon.svg' alt='The Standard Icon' width='25px' />
            }
          </StyledLogoContainer>

        {!mobile && terms ?
        <nav>
          <Web3Button />
        </nav>
        :
        <nav>
          <StyledMobileConnectNavContainer>
            <a className="mobileMenuClickHandler" onClick={mobileOpenClickHandler}>{!openState ? <FaBars /> : <GrClose />}</a>

            {
              openState && terms && (
                <StyledMobileConnectNavDropdownContainer>
                  <Web3Button />

                  <StyledMobileLinksContainer>
                    <FooterLinks />
                  </StyledMobileLinksContainer>
                </StyledMobileConnectNavDropdownContainer>
              )
            }

          </StyledMobileConnectNavContainer>

        </nav>
        }
      </StyledConnectNavContainer>
    )
}

export default ConnectNav;
