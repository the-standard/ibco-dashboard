/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextPage } from 'next'
import Footer from '../components/shared/footer'
import ConnectNav from '../components/shared/navigation/ConnectNav'
import SubNavigation from '../components/shared/navigation/SubNavigation'
import NextHeadComponent from '../components/shared/NextHeadComponent'
import Web3BondInterface from '../components/Web3BondInterface'

//@ts-ignore
const Stage2: NextPage = () => {
  return (
    <div>
      <NextHeadComponent title="The Standard | sEURO Bonding" description='sEURO Bonding' />
      
      <ConnectNav />
      <SubNavigation />

      <main className="container mx-auto w-4/12">
        <Web3BondInterface />
      </main>

      <Footer />
    </div>
  )
}

export default Stage2
