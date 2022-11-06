import { Link } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import NextLink from 'next/link'
import React, { useEffect, useState } from 'react'
import { Head, MetaProps } from './Head'
import axios from 'axios'
import { useAccount } from 'wagmi'

interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

export const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  const { address } = useAccount()
  const [ownsNFT, setOwnsNFT] = useState(false)
  useEffect(() => {
    const fetchOwnership = async () => {
      try {
        const url = `/api/nft/0x246770348D8fEA72E45c0BbFFdda4A8170a73aC1/ownedBy?address=${address}`
        const result = await axios.get(url)
        setOwnsNFT(result.data.ownedBy as boolean)
      } catch (e) {
        console.log(e)
      }
    }

    fetchOwnership()
  }, [address])

  return (
    <div className="bg-slate-900 w-full h-full overflow-y-scroll text-white min-h-screen p-4 w-full items-center flex flex-col content-center justify-center">
      <Head customMeta={customMeta} />
      <h1 className="text-center p-6 text-4xl font-bold gradient-text">
        COMPLISEND
      </h1>

      <div className="w-1/2">
        <div className="bg-blue-500 rounded-lg p-1 px-3 mb-2 font-bold w-64 items-center flex flex-row content-center h-12">
          <NextLink href="/" passHref>
            <Link>
              <span className="text-white">Home</span>
            </Link>
          </NextLink>
          <NextLink href="/history" passHref>
            <Link className="bg-blue-500 rounded-lg text-white p-2 px-3 m-2">
              History
            </Link>
          </NextLink>
          <NextLink href="/audit" passHref>
            <Link className="bg-blue-500 rounded-lg text-white p-2 px-3 m-2">
              Audit
            </Link>
          </NextLink>
        </div>
        <div className="bg-slate-800 p-4 rounded-md">
          <ConnectButton />
        </div>
        <div>{`owns NFT: ${ownsNFT}`}</div>
      </div>

      {children}
    </div>
  )
}
