import type { AppProps } from 'next/app'
import { Web3ContextProvider } from '../context'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TagManager from 'react-gtm-module';
import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalColors } from '../styles/globalColors';
import GlobalCSS from '../styles/globalStyles';
import 'react-toastify/scss/main.scss'
import { StyledGlobalBetaBanner } from '../components/shared/uiElements/styles/SharedStylesGlobal';
// import { Web3Button } from '../components'

function getInitialProps() {
  return {};  
}

const theme = {
  colors: GlobalColors
}

function MyApp({ Component, pageProps }: AppProps) {
  //const {web3Provider} = useWeb3Context();

  useEffect(() => {
      TagManager.initialize({ gtmId: 'GTM-5G25J82' });
  }, []);

  return (
    <Web3ContextProvider>
      <ThemeProvider theme={theme}>
      <GlobalCSS />
      {/* {
        !web3Provider && <div className="connectModal mx-auto">
            <p className="mb-4">You must connect your wallet to continue</p>
          <div>
            <Web3Button />
          </div>
          </div>
      } */}
      <StyledGlobalBetaBanner>BETA Release! Testnet Only. Design to be updated soon. Report bugs <a href="https://bit.ly/ibco-bugs">here</a>!</StyledGlobalBetaBanner>
        <Component {...pageProps} />
        <ToastContainer
          hideProgressBar
          position="top-right"
          autoClose={2000}
        />
      </ThemeProvider>
    </Web3ContextProvider>
  )
}

MyApp.getInitialProps = getInitialProps;

export default MyApp
