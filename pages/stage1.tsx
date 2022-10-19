/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextPage } from 'next'
import ConnectNav from '../components/shared/navigation/ConnectNav';
import SubNavigation from '../components/shared/navigation/SubNavigation';
import NextHeadComponent from '../components/shared/NextHeadComponent';
import { isMobile } from "react-device-detect";
import { Web3SwapInterface } from '../components';
import { TokenInformationInterface, BondingCurveInterface } from '../components';
import { Contract, SmartContractManager, TOKENS } from '../Utils';
import Footer from '../components/shared/footer';
import { useWeb3Context } from '../context';
import { GetJsonAddresses } from '../Utils/ContractManager';
import { useEffect, useState } from 'react';
import DescriptionContainer from '../components/shared/uiElements/DescriptionContainer/DescriptionContainer';
import { StyledGlobalContainer } from '../components/shared/uiElements/styles/SharedStylesGlobal';
import { StyledAddressHolderP, StyledCopyButton, StyledDesktopCopyButton, StyledLeftRightColContainer, StyledSupplyContainer, StyledTokenInfoLeftCol, StyledTokenInfoRightCol } from '../components/StageComponents/SwapStage/Styles';
import { toast } from 'react-toastify';

const Stage1: NextPage = () => {
  const [seuroAddress, setSeuroAddress] = useState('');
  const { network } = useWeb3Context();
  const _network = network?.name === 'homestead' ? 'main' : network?.name || 'goerli';
  const BondingCurveContract = SmartContractManager('BondingCurve' as Contract).then((data) =>  data);
  const [mobile, setMobile] = useState();
  const [copied, setCopied] = useState(false);
  const [loadCalls, setLoadCalls] = useState(1);

  useEffect(() => {
    if (loadCalls === 2) {
      if (network === null) window.location.href = '/';
    }
    setLoadCalls(loadCalls+1);
    getTokenAddress();
  }, [network]);

  useEffect(() => {
    //@ts-ignore
    setMobile(isMobile)
  }, [setMobile]);

  const getTokenAddress = async() => {
    //@ts-ignore
    return seuroAddress === '' ? await GetJsonAddresses().then((data:never) => {
      //@ts-ignore
      setSeuroAddress(data[_network]['TOKEN_ADDRESSES']['SEURO']);
      return seuroAddress;
    })
    :
    seuroAddress
  }

  const copyToClipboardClickFunction = () => {
    navigator.clipboard.writeText(seuroAddress).then(() => {toast.success('Copied to clipboard, please import token into MetaMask'); setCopied(true)}).catch(() => {toast.error('unable to copy address, please manually select and copy'); setCopied(false)});
  }

  return (
    <StyledGlobalContainer>
      <NextHeadComponent title="The Standard | Get sEURO" description='Get sEURO' />
      
      <ConnectNav />
      <SubNavigation />

      <main>
        <DescriptionContainer>
          <b>What is Stage 1?</b> The Bonding Curve allows users to swap their collateral for sEURO. Initially, sEURO is discounted by 20% meaning 1 EURO of ETH will be exchanged for 1.2 sEURO. This discount declines until the total supply has been exhausted.
        </DescriptionContainer>

        <StyledLeftRightColContainer>
          <StyledTokenInfoLeftCol>
            <StyledSupplyContainer>
              <h2>{TOKENS.DISPLAY.SEURO} Address:</h2> <StyledAddressHolderP>{seuroAddress}</StyledAddressHolderP>
             { mobile ? <StyledCopyButton onClick={copyToClipboardClickFunction}>{copied ? 'Copied to clipboard' : 'Add to MetaMask'}</StyledCopyButton> : <StyledDesktopCopyButton>Add to MetaMask</StyledDesktopCopyButton>}
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
    </StyledGlobalContainer>
  )
} 

export default Stage1
