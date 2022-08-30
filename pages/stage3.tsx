import type { NextPage } from 'next'
import { Web3StakingInterface } from '../components'
import Footer from '../components/shared/footer'
import ConnectNav from '../components/shared/navigation/ConnectNav'
import SubNavigation from '../components/shared/navigation/SubNavigation'
import NextHeadComponent from '../components/shared/NextHeadComponent'

const Stage3: NextPage = () => {

  return (
    <div>
      <NextHeadComponent title="The Standard | TST Staking" description='TST Staking' />

      <ConnectNav />
      <SubNavigation />

      <main>
        <Web3StakingInterface />
      </main>
      
      <Footer />
    </div>
  )
}

export default Stage3
