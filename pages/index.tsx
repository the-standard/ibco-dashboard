import type { NextPage } from 'next'
import { Web3Button } from '../components'
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import Footer from '../components/shared/footer'
import ConnectNav from '../components/shared/navigation/ConnectNav'
import NextHeadComponent from '../components/shared/NextHeadComponent'
import { StyledIndexContainer, StyledIndexDescriptionContainer } from '../components/shared/uiElements/styles/IndexStyles'
import { StyledGlobalContainer } from '../components/shared/uiElements/styles/SharedStylesGlobal'
import { useWeb3Context } from '../context'
import Cookies from 'universal-cookie';

const Home: NextPage = () => {
  const cookies = new Cookies();
  const { network } = useWeb3Context();
  const [mobile, setMobile] = useState<boolean>();
  const [terms, setTerms] = useState<boolean>();

  useEffect(() => {
    setMobile(isMobile)
  }, [setMobile]);

  useEffect(() => {
    const x = cookies.get('_ibcotv1');
    if (!!x) {
      setTerms(true);
    };
  }, [terms]);

  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked(!checked);
    const d = Math.floor(new Date() / 1000);
    cookies.set('_ibcotv1', d, { path: '/' });
    setTerms(true);
    alert('Sweet Jesus, you\'re not from the US of A!')
  };

  return (
    <StyledGlobalContainer>
    <NextHeadComponent title="The Standard" description='The Standard IO DAO' />

    <ConnectNav />

    <StyledIndexContainer>
      <StyledIndexDescriptionContainer>
        <h2>Welcome to The Standard Initial Bonding Curve Offering</h2>

        { !terms ?
        <div>
            <label>
              <input
                type="checkbox"
                checked={checked}
                onChange={handleChange}
              />
              I promise I'm not from the US of A or somewhere like that.
            </label>
        </div> : '' }

        { !terms ? '' :
          <span style={{ textAlign: 'centre '}}>
        { mobile ?
            <h4>Not available on mobile right now, please swap to a desktop device.</h4>
          :
            <p>Please connect your wallet to proceed</p>
        }
        {!network && !mobile && <Web3Button />}
        </span>
        }
      </StyledIndexDescriptionContainer>
    </StyledIndexContainer>

    <Footer />
  </StyledGlobalContainer>
  )
}

export default Home
