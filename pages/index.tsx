/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextPage } from 'next'
import { Web3Button } from '../components'
import React, { useEffect, useState } from "react";
import Footer from '../components/shared/footer'
import ConnectNav from '../components/shared/navigation/ConnectNav'
import NextHeadComponent from '../components/shared/NextHeadComponent'
import { StyledIndexContainer, StyledIndexDescriptionContainer } from '../components/shared/uiElements/styles/IndexStyles'
import { StyledSupplyContainer } from "../components/StageComponents/SwapStage/Styles";

import { StyledGlobalContainer, StyledPushFooter } from '../components/shared/uiElements/styles/SharedStylesGlobal'
import { useWeb3Context } from '../context'
import Cookies from 'universal-cookie';
import { CurrentBreakpoint } from '../hooks/BreakpointObserver';

const Home: NextPage = () => {
  const cookies = new Cookies();
  const { network } = useWeb3Context();
  const [mobile, setMobile] = useState<boolean>();
  const [terms, setTerms] = useState<boolean>();
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

  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked(!checked);
    const d = Math.floor(Date.now() / 1000);
    const then = new Date((d + 86400) * 1000);
    cookies.set('_ibcotv1', d, { path: '/', expires: then });
    setTerms(true);
  };

  return (
    <StyledGlobalContainer>
    <NextHeadComponent title="The Standard" description='The Standard IO DAO' />

    <ConnectNav />

    <StyledPushFooter>
      <StyledIndexContainer>
      <StyledIndexDescriptionContainer>
        <h2>Welcome to The Standard Initial Bonding Curve Offering</h2>

        { !terms ?
            <StyledSupplyContainer>
            <span style={{ padding: '20px' }}>
              <h2>Disclaimer</h2>
              <p>The Standard is a fully decentralized stablecoin. No representation or warranty is made concerning any aspect of the The Standard.io, including its suitability, quality, availability, accessibility, accuracy or safety. As more fully explained in the Terms of Use, your access to and use of the The Standard.io and smart contracts through this interface is entirely at your own risk and could lead to substantial losses. You take full responsibility for your use of the interface, and acknowledge that you use it on the basis of your own enquiry, without solicitation or inducement by Contributors (as defined in the Terms of Use).</p>
              <p>This interface is not available to residents of Belarus, the Central African Republic, the Democratic Republic of Congo, the Democratic People’s Republic of Korea, the Crimea region of Ukraine, Cuba, Iran, Libya, Somalia, Sudan, South Sudan, Syria, the USA, Yemen, and Zimbabwe or any other jurisdiction in which accessing or using The Standard.io is prohibited (“Prohibited Jurisdictions”). In using this interface, you confirm that you are not located in, incorporated or otherwise established in, or a citizen or resident of, a Prohibited Jurisdiction.</p>
            <label>
              <input
                type="checkbox"
                checked={checked}
                onChange={handleChange}
              />
            </label>
            &nbsp; I confirm that I have read, understand and accept the Terms of Use
            </span>
        </StyledSupplyContainer> : '' }

        { !terms ? '' :
          <>
            { mobile ?
                <h4>Not available on mobile right now, please swap to a desktop device.</h4>
              :
                <p>Please connect your wallet to proceed</p>
            }
            {!network && !mobile && <Web3Button />}
        </>
        }
      </StyledIndexDescriptionContainer>
    </StyledIndexContainer>

    <Footer />
    </StyledPushFooter>
    
  </StyledGlobalContainer>
  )
}

export default Home
