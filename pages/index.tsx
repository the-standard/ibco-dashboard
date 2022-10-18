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
        <h2>Lorem ipsum dolor sit amet</h2>
        <p>this is some information</p>
        {!network && <Web3Button />}
      </StyledIndexDescriptionContainer>

      <main>
        <StyledTokenInformationContainer>Token information</StyledTokenInformationContainer>
      </main>
    </StyledIndexContainer>

    <Footer />
  </StyledGlobalContainer>
  )
}

export default Home
