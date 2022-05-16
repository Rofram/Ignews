import { AppProps } from 'next/app'
import Head from 'next/head';
import { SessionProvider } from "next-auth/react"
import { Header } from '../components/Header';

import '../styles/global.scss'

export default function MyApp({ 
    Component, 
    pageProps: { session, ...pageProps } 
  }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SessionProvider session={session}>
        <Header />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}