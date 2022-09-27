import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Web3ContextProvider } from '../context'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TagManager from 'react-gtm-module';
import { useEffect } from 'react'
// import { Web3Button } from '../components'

function MyApp({ Component, pageProps }: AppProps) {
  //const {web3Provider} = useWeb3Context();

  useEffect(() => {
      TagManager.initialize({ gtmId: 'GTM-5G25J82' });

  }, []);

  return (
    <Web3ContextProvider>
      <>
      {/* {
        !web3Provider && <div className="connectModal mx-auto">
            <p className="mb-4">You must connect your wallet to continue</p>
          <div>
            <Web3Button />
          </div>
          </div>
      } */}
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
