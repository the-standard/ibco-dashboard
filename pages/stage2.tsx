/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Footer from '../components/shared/footer'
import ConnectNav from '../components/shared/navigation/ConnectNav'
import SubNavigation from '../components/shared/navigation/SubNavigation'
import NextHeadComponent from '../components/shared/NextHeadComponent'
import { StyledGlobalContainer } from '../components/shared/uiElements/styles/SharedStylesGlobal'
import Web3BondInterface from '../components/StageComponents/BondStage/Web3BondInterface'
import { useWeb3Context } from '../context'

//@ts-ignore
const Stage2: NextPage = () => {
  const { network } = useWeb3Context();
  const [loadCalls, setLoadCalls] = useState(1);
  
  useEffect(() => {
    if (loadCalls === 2) {
      if (network === null) window.location.href = '/';
    }
    setLoadCalls(loadCalls+1);
  }, [network]);
  
  return (
    <StyledGlobalContainer>
      <NextHeadComponent title="The Standard | sEURO Bonding" description='sEURO Bonding' />
      
      <ConnectNav />
      <SubNavigation />

      <main>
        <Web3BondInterface />
      </main>

      <Footer />
    </StyledGlobalContainer>
  )
}

export default Stage2
