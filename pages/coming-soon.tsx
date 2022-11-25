/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextPage } from 'next'
import Footer from '../components/shared/footer'
import NextHeadComponent from '../components/shared/NextHeadComponent'
import CountdownTimer from '../components/shared/uiElements/CountdownTimer/CountdownTimer'
import { StyledGlobalContainer, StyledPushFooter } from '../components/shared/uiElements/styles/SharedStylesGlobal'

//@ts-ignore
const ComingSoon: NextPage = () => {
  return (
    <StyledGlobalContainer>
      <NextHeadComponent title="The Standard | Coming Soon" description='sEURO Bonding, Swapping and Staking coming soon' />

      <StyledPushFooter>
        <main>
            <CountdownTimer />
        </main>

        <Footer />
      </StyledPushFooter>
      
    </StyledGlobalContainer>
  )
}

export default ComingSoon
