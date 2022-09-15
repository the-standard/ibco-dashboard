import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Web3ContextProvider } from '../context'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TagManager from 'react-gtm-module';
import { useEffect } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    TagManager.initialize({ gtmId: 'GTM-5G25J82' });
}, []);

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
