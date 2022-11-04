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
// import { CurrentBreakpoint } from '../hooks/BreakpointObserver';

const Home: NextPage = () => {
  const cookies = new Cookies();
  const { network } = useWeb3Context();
  // const [mobile, setMobile] = useState<boolean>();
  const [terms, setTerms] = useState<boolean>();
  // const breakpoint = CurrentBreakpoint();

  // useEffect(() => {
  //   //@ts-ignore
  //   setMobile(breakpoint !== 'desktop');
  // }, [setMobile, breakpoint]);

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
            <label>
              <input
                type="checkbox"
                checked={checked}
                onChange={handleChange}
              />
            </label>
            &nbsp; I pinky promise I&apos;m not from one of the places that&apos;s not allowed to use IBCO.
            </span>
        </StyledSupplyContainer> : '' }

        { !terms ? '' :
          <>
            {/* { mobile ?
                <h4>Not available on mobile right now, please swap to a desktop device.</h4>
              :
                <p>Please connect your wallet to proceed</p>
            } */}
            {!network && <Web3Button />}
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
