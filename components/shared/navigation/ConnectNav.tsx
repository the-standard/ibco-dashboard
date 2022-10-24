/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from "react";
import { Web3Button } from "../../../components/shared/uiElements/Web3Button";
import { isMobile } from "react-device-detect";
import { StyledConnectNavContainer, StyledLogoContainer } from "./styles/ConnectNavStyles";
// import { StyledConnectNavContainer, StyledLogoContainer, StyledMobileConnectNavContainer, StyledMobileConnectNavDropdownContainer, StyledMobileLinksContainer } from "./styles/ConnectNavStyles";
// import { Menu, X } from 'react-feather';
// import { FooterLinks } from "../footerLinks";

const ConnectNav = () => {
    const [mobile, setMobile] = useState();
    // const [openState, setOpenState] = useState(false);

    useEffect(() => {
      //@ts-ignore
      setMobile(isMobile)
    }, [setMobile]);

    // const mobileOpenClickHandler = () => {
    //   setOpenState(!openState);
    // }

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

        {!mobile ?
        <nav className="grid justify-items-end p-4">
          <Web3Button />
        </nav>
        :
        <nav className="grid justify-items-end p-4">
          {/*  <StyledMobileConnectNavContainer>
            <a className="mobileMenuClickHandler" onClick={mobileOpenClickHandler}>{!openState ? <Menu size={30} /> : <X size={30}/>}</a>

            {
              openState && (
                <StyledMobileConnectNavDropdownContainer>
                  <Web3Button />

                  <StyledMobileLinksContainer>
                    <FooterLinks />
                  </StyledMobileLinksContainer>
                </StyledMobileConnectNavDropdownContainer>
              )
            }

          </StyledMobileConnectNavContainer> */}

        </nav>
        }
      </StyledConnectNavContainer>
    )
}

export default ConnectNav;
