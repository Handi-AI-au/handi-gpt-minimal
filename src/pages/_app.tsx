import Head from 'next/head'
import '@/styles/globals.css'
import 'antd/dist/antd.css'
import type { AppProps } from 'next/app'
import { ImageContextProvider } from '@/models/imageContext'
import { useAnalytics } from '@/hooks/useAnalytics'

export default function App({ Component, pageProps }: AppProps) {
  // 初始化 analytics
  useAnalytics();

  return (
    <>
      <Head>
        <title>Handi AI</title>
        <meta
          name="viewport"
          content="width=device-width,height=device-height,inital-scale=1.0,maximum-scale=1.0,user-scalable=no"
        />
        <meta name="description" content="Handi AI - 智能对话与图像分析助手" />
      </Head>
      <ImageContextProvider>
        <Component {...pageProps} />
      </ImageContextProvider>
    </>
  )
}
