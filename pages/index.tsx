import type { NextPage } from 'next'
import { Web3Button } from '../components'
import Footer from '../components/shared/footer'
import ConnectNav from '../components/shared/navigation/ConnectNav'
import NextHeadComponent from '../components/shared/NextHeadComponent'
import { StyledIndexContainer, StyledIndexDescriptionContainer, StyledTokenInformationContainer } from '../components/shared/uiElements/styles/IndexStyles'
import { StyledGlobalContainer } from '../components/shared/uiElements/styles/SharedStylesGlobal'
import { useWeb3Context } from '../context'

const Home: NextPage = () => {
  const { network } = useWeb3Context();
  
  return (
    <StyledGlobalContainer>
    <NextHeadComponent title="The Standard" description='The Standard IO DAO' />
    
    <ConnectNav />

    <StyledIndexContainer>
      <StyledIndexDescriptionContainer>
        <h2>Welcome to The Standard Initial Bonding Curve Offering</h2>
        <p>Please connect your wallet to proceed</p>
        {!network && <Web3Button />}
      </StyledIndexDescriptionContainer>

      <main>
        <StyledTokenInformationContainer>Token information coming soon</StyledTokenInformationContainer>
      </main>
    </StyledIndexContainer>

    <Footer />
  </StyledGlobalContainer>
  )
}

export default Home
