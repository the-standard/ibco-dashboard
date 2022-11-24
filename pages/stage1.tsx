/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextPage } from 'next'
import ConnectNav from '../components/shared/navigation/ConnectNav';
import SubNavigation from '../components/shared/navigation/SubNavigation';
import NextHeadComponent from '../components/shared/NextHeadComponent';
import { Web3SwapInterface } from '../components';
import { TokenInformationInterface, BondingCurveInterface } from '../components';
import { Contract, SmartContractManager, TOKENS } from '../Utils';
import Footer from '../components/shared/footer';
import { useWeb3Context } from '../context';
import { useEffect, useState } from 'react';
import DescriptionContainer from '../components/shared/uiElements/DescriptionContainer/DescriptionContainer';
import { StyledGlobalContainer, StyledPushFooter } from '../components/shared/uiElements/styles/SharedStylesGlobal';
import { StyledAddressHolderP, StyledCopyButton, StyledDesktopCopyButton, StyledLeftRightColContainer, StyledSupplyContainer, StyledTokenInfoLeftCol, StyledTokenInfoRightCol } from '../components/StageComponents/SwapStage/Styles';
import { AddToMetamaskHelper } from '../Utils';
import { CurrentBreakpoint } from '../hooks/BreakpointObserver';

const Stage1: NextPage = () => {
  const [seuroAddress, setSeuroAddress] = useState('');
  const { network } = useWeb3Context();
  const BondingCurveContract = SmartContractManager('BondingCurve' as Contract).then((data) =>  data);
  const SEuroOffering = SmartContractManager('SEuroOffering' as Contract).then((data) => data);
  const [mobile, setMobile] = useState();
  const breakpoint = CurrentBreakpoint();

  useEffect(() => {
    getSeuroAddress();
  }, [network]);

  useEffect(() => {
    //@ts-ignore
    setMobile(breakpoint !== 'desktop');
  }, [setMobile, breakpoint]);

  const getSeuroAddress = async () => {
    const stgContract = await SEuroOffering;
    //@ts-ignore
    stgContract.methods.Seuro().call().then((data:never) => {
      setSeuroAddress(data);
    });
  };

  const copyToClipboardClickFunction = () => {
    seuroAddress && AddToMetamaskHelper(seuroAddress);
  }

  return (
    <StyledGlobalContainer>
      <NextHeadComponent title="The Standard | Get sEURO" description='Get sEURO' />
      
      <ConnectNav />
      <SubNavigation />

      <StyledPushFooter>
         <main>
        <DescriptionContainer>
          Stage1: Initial Discount Curve Offering for Standard Euro (sEURO)<br />Mint sEURO at a massive discount starting at 80 cents. As more liquidity comes into the pool, the discount will become less until we reach a 1:1 peg. The sEURO is only considered a stablecoin once the Stage 1 discount reaches 1:1 and the protocol controlled value is greater than the sEURO minted.
        </DescriptionContainer>

        <StyledLeftRightColContainer>
          <StyledTokenInfoLeftCol>
            <StyledSupplyContainer>
              <h2>{TOKENS.DISPLAY.SEURO} Address:</h2> <StyledAddressHolderP>{seuroAddress}</StyledAddressHolderP>
             { mobile ? <StyledCopyButton onClick={copyToClipboardClickFunction}>Add to MetaMask</StyledCopyButton> : <StyledDesktopCopyButton onClick={copyToClipboardClickFunction}>Add to MetaMask</StyledDesktopCopyButton>}
            </StyledSupplyContainer>
            {
              <>
                <TokenInformationInterface bondingCurveContract={BondingCurveContract} />
                <BondingCurveInterface />
              </>
            }
          </StyledTokenInfoLeftCol>
          
          <StyledTokenInfoRightCol>
            <Web3SwapInterface />
          </StyledTokenInfoRightCol>
        </StyledLeftRightColContainer>
      </main>

      <Footer />
      </StyledPushFooter>
     
    </StyledGlobalContainer>
  )
} 

export default Stage1
