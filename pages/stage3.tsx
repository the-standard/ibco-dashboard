import type { NextPage } from 'next'
import { Web3StakingInterface } from '../components'
import Footer from '../components/shared/footer'
import ConnectNav from '../components/shared/navigation/ConnectNav'
import SubNavigation from '../components/shared/navigation/SubNavigation'
import NextHeadComponent from '../components/shared/NextHeadComponent'
import { StyledGlobalContainer, StyledPushFooter } from '../components/shared/uiElements/styles/SharedStylesGlobal'
import { StyledMainContainer } from '../components/StageComponents/StakeStage/Styles'

const Stage3: NextPage = () => {
  return (
    <StyledGlobalContainer>
      <NextHeadComponent title="The Standard | TST Staking" description='TST Staking' />

      <ConnectNav />
      <SubNavigation />

      <StyledPushFooter>
        <StyledMainContainer>
          <Web3StakingInterface />
        </StyledMainContainer>
        
        <Footer />
      </StyledPushFooter>
      
    </StyledGlobalContainer>
  )
}

export default Stage3
