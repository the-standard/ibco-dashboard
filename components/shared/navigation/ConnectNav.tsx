/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from "react";
import { Web3Button } from "../../../components/shared/uiElements/Web3Button";
import { isMobile } from "react-device-detect";
import { StyledConnectNavContainer, StyledLogoContainer } from "./styles/ConnectNavStyles";
import Cookies from 'universal-cookie';

const ConnectNav = () => {
    const cookies = new Cookies();
    const [mobile, setMobile] = useState();
    const [terms, setTerms] = useState<boolean>();

    useEffect(() => {
      //@ts-ignore
      setMobile(isMobile)
    }, [setMobile]);

    useEffect(() => {
      const x = cookies.get('_ibcotv1');
      if (!!x) {
        setTerms(true);
      };
    }, [terms]);

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
        <nav className="grid justify-items-end p-4">
          <Web3Button />
        </nav>
        :
        ''
        }
      </StyledConnectNavContainer>
    )
}

export default ConnectNav;
