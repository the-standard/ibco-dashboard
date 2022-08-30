import type { NextPage } from 'next'
import Head from 'next/head'
import { Web3Button } from '../components/'

import SubNavigation from '../components/shared/navigation/SubNavigation'

const Home: NextPage = () => {
  return (
    <div className="flex h-screen flex-col">
      <Head>
        <title>The Standard - IBCO Dashboard</title>
        <meta name="description" content="The Standard - IBCO Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="grid justify-items-end p-4">
        {/* <Link href="/about">
          <a className="text-lg font-light">About</a>
        </Link> */}
        {/* <Web3Address /> */}
        <Web3Button />
      </nav>

        <SubNavigation />

      <main className="flex flex-row justify-between p-4">
       information about the coin
      </main>
    </div>
  )
}

export default Home
