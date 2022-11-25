/* eslint-disable @typescript-eslint/ban-ts-comment */
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

function getInitialProps() {
  return {};  
}

const theme = {
  colors: GlobalColors
}
//@ts-ignore
function SafeHydrate({ children }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
      TagManager.initialize({ gtmId: 'GTM-5G25J82' });
  }, []);

  return (
    <SafeHydrate>
      <Web3ContextProvider>
        <ThemeProvider theme={theme}>
        <GlobalCSS />
          <Component {...pageProps} />
          <ToastContainer
            hideProgressBar
            position="top-right"
            autoClose={2000}
            theme='dark'
          />
        </ThemeProvider>
      </Web3ContextProvider>
    </SafeHydrate>
  )
}

MyApp.getInitialProps = getInitialProps;

export default MyApp
