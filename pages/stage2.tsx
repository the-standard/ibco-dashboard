/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextPage } from 'next'
import Footer from '../components/shared/footer'
import ConnectNav from '../components/shared/navigation/ConnectNav'
import SubNavigation from '../components/shared/navigation/SubNavigation'
import NextHeadComponent from '../components/shared/NextHeadComponent'
import { StyledGlobalContainer } from '../components/shared/uiElements/styles/SharedStylesGlobal'
import { StyledMainContainer } from '../components/StageComponents/BondStage/Styles'
import Web3BondInterface from '../components/StageComponents/BondStage/Web3BondInterface'

//@ts-ignore
const Stage2: NextPage = () => {
  return (
    <StyledGlobalContainer>
      <NextHeadComponent title="The Standard | sEURO Bonding" description='sEURO Bonding' />
      
      <ConnectNav />
      <SubNavigation />

      <StyledMainContainer>
        <Web3BondInterface />
      </StyledMainContainer>

      <Footer />
    </StyledGlobalContainer>
  )
}

export default Stage2
