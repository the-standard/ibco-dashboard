import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Web3StakingInterface } from '../components'
import Footer from '../components/shared/footer'
import ConnectNav from '../components/shared/navigation/ConnectNav'
import SubNavigation from '../components/shared/navigation/SubNavigation'
import NextHeadComponent from '../components/shared/NextHeadComponent'
import { StyledGlobalContainer } from '../components/shared/uiElements/styles/SharedStylesGlobal'
import { StyledMainContainer } from '../components/StageComponents/StakeStage/Styles'
import { useWeb3Context } from '../context'

const Stage3: NextPage = () => {
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
      <NextHeadComponent title="The Standard | TST Staking" description='TST Staking' />

      <ConnectNav />
      <SubNavigation />

      <StyledMainContainer>
        <Web3StakingInterface />
      </StyledMainContainer>
      
      <Footer />
    </StyledGlobalContainer>
  )
}

export default Stage3
