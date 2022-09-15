import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Web3ContextProvider } from '../context'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import ReactGA from 'react-ga';
const TRACKING_ID = "UA-240199374-1"; // OUR_TRACKING_ID

function MyApp({ Component, pageProps }: AppProps) {
  ReactGA.initialize(TRACKING_ID);

  return (
    <Web3ContextProvider>
      <>
      <div className="w-full p-2 mx-auto betaBanner text-center">BETA Release! Testnet Only. Design to be updated soon. Report bugs <a href="https://bit.ly/ibco-bugs">here</a>!</div>
        <Component {...pageProps} />
        <ToastContainer
          hideProgressBar
          position="top-right"
          autoClose={2000}
        />
      </>
    </Web3ContextProvider>
  )
}

export default MyApp
