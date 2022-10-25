import type { NextPage } from 'next'
import { Web3Button } from '../components'
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import Footer from '../components/shared/footer'
import ConnectNav from '../components/shared/navigation/ConnectNav'
import NextHeadComponent from '../components/shared/NextHeadComponent'
import { StyledIndexContainer, StyledIndexDescriptionContainer, StyledTokenInformationContainer } from '../components/shared/uiElements/styles/IndexStyles'
import { StyledGlobalContainer } from '../components/shared/uiElements/styles/SharedStylesGlobal'
import { useWeb3Context } from '../context'

const Home: NextPage = () => {
  const { network } = useWeb3Context();
  const [mobile, setMobile] = useState();
  
  useEffect(() => {
    //@ts-ignore
    setMobile(isMobile)
  }, [setMobile]);

  return (
    <StyledGlobalContainer>
    <NextHeadComponent title="The Standard" description='The Standard IO DAO' />
    
    <ConnectNav />

    <StyledIndexContainer>
      <StyledIndexDescriptionContainer>
        <h2>Welcome to The Standard Initial Bonding Curve Offering</h2>
        { mobile ? 
            <h4>Not available on mobile right now, please swap to a desktop device.</h4>
          : 
            <p>Please connect your wallet to proceed</p>
        }
        {!network && !mobile && <Web3Button />}
      </StyledIndexDescriptionContainer>
    </StyledIndexContainer>

    <Footer />
  </StyledGlobalContainer>
  )
}

export default Home
