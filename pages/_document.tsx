// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
      </Head>
      <body className="container mx-auto w-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
