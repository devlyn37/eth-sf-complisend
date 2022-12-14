// import { ChakraProvider } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  connectorsForWallets,
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import XmtpProvider from '../providers/XmtpProvider'
import './index.css'

//@ts-ignore
global.AUDITOR_ETH_ADDRESS = '0xE898BBd704CCE799e9593a9ADe2c1cA0351Ab660'

const devChains = [
  chain.goerli,
  chain.polygonMumbai,
  chain.optimismGoerli,
  chain.arbitrumGoerli,
]
const prodChains = [
  chain.mainnet,
  chain.polygon,
  chain.optimism,
  chain.arbitrum,
]

const { chains, provider, webSocketProvider } = configureChains(
  process.env.PRODUCTION === 'true' ? prodChains : devChains,
  [publicProvider()]
)

const { wallets } = getDefaultWallets({
  appName: 'RainbowKit demo',
  chains,
})

const demoAppInfo = {
  appName: 'Rainbowkit Demo',
}

const connectors = connectorsForWallets(wallets)

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps<{}>) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        appInfo={demoAppInfo}
        chains={chains}
        theme={darkTheme({
          borderRadius: 'small',
        })}
      >
        <XmtpProvider>
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
        </XmtpProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
