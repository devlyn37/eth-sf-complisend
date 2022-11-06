import { Container, Flex, Link, SimpleGrid, Text } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import NextLink from 'next/link'
import React from 'react'
import { Head, MetaProps } from './Head'

interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

export const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  return (<div className='bg-black text-white'>
      <Head customMeta={customMeta} />
      <h1 className="text-center p-6 text-4xl font-bold gradient-text">
        COMPLISEND
      </h1>
      <Flex py={[4, null, null, 0]}>
        <NextLink href="/" passHref>
          <Link className='bg-blue-500 rounded-lg p-2 px-3 m-2 font-bold'>
            <span className='text-white'>Home</span>
            
          </Link>
        </NextLink>
        <NextLink href="/history" passHref>
          <Link className='bg-blue-500 rounded-lg text-white p-2 px-3 m-2'>
            History
          </Link>
        </NextLink>
        <NextLink href="/audit" passHref>
          <Link className='bg-blue-500 rounded-lg text-white p-2 px-3 m-2'>
            Audit
          </Link>
        </NextLink>
      </Flex>
      <ConnectButton />
      {children} 
  </div>)
}
