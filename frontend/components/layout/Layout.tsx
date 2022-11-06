import { Link } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import NextLink from 'next/link'
import ActiveLink from './ActiveLink'
import React from 'react'
import { Head, MetaProps } from './Head'
import { useAccount } from 'wagmi'
import { useCheckOwnership } from '../../hooks/useCheckOwnership'
import { CheckBadgeIcon, CheckCircleIcon, HomeIcon,InboxIcon,PaperAirplaneIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid'


interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}



export const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  const { address } = useAccount()
  const connectedOwnsNFT = useCheckOwnership(address)

  //@ts-ignore
  const is_auditor = (String(address) == AUDITOR_ETH_ADDRESS)

  const verifiedBadge = (label:string,verified:boolean) => {
    if (!verified){
      return <div className='rounded-md bg-red-500 text-white self-center w-fit mr-3 p-1 px-3 flex flex-row items-center'><ShieldExclamationIcon className='w-12 p-2'/><strong className='pr-4'>{label}</strong></div>
    }else{
      return <div className='rounded-md bg-green-500 text-black self-center w-fit mr-3 p-1 px-3 flex flex-row items-center content-center'><CheckCircleIcon className='w-12 p-2'/><strong className='pr-4'>{label}</strong></div>
    }
  }

  return (
    <div className="bg-slate-900 w-full min-h-screen overflow-y-scroll text-white min-h-screen p-4 w-full items-center flex flex-col content-center min-h-screen">
      <Head customMeta={customMeta} />
      

      <div className="w-full container flex flex-col items-stretch" style={{width:'40em'}}>
        <h1 className="text-left py-4 text-6xl font-bold header m-0 w-full pb-4">
          COMPLISEND
        </h1>
        <div className='flex flex-row items-center content-center justify-center mb-6 '>
          <div className="cursor-pointer bg-blue-500 text-blue-300 self-center rounded-lg font-bold w-fit flex flex-row content-center h-12 overflow-hidden">
            <ActiveLink activeClassName="bg-blue-600 text-white" href="/" passHref>
              <div className="hover:text-white px-4 hover:bg-blue-600 flex flex-row items-center"><PaperAirplaneIcon className='w-12 p-2'></PaperAirplaneIcon><strong>send</strong></div> 
            </ActiveLink>
            
            <ActiveLink activeClassName="text-white bg-blue-600 " href="/history" passHref>
              <div className="hover:text-white px-4 hover:bg-blue-600 flex flex-row items-center"><InboxIcon className='w-12 p-2'></InboxIcon><strong>inbox</strong></div>
            </ActiveLink>
          </div>
          {is_auditor && <ActiveLink activeClassName="bg-red-600 text-white " href="/audit" passHref >
              <div className="h-12 rounded-lg ml-2 cursor-pointer hover:text-white text-red-200 px-4 hover:bg-red-600 bg-red-500 flex flex-row items-center"><CheckBadgeIcon className='w-12 p-2'></CheckBadgeIcon><strong>audit</strong></div>
            </ActiveLink>}
        </div>
        
        <div className="bg-slate-800 p-4 rounded-md flex flex-col">
          {/* <div>{`owns NFT: ${connectedOwnsNFT}`}</div> */}
          <ConnectButton />
          
        </div>
        <div className='w-full flex flex-col mt-2 bg-slate-800 p-4 rounded-md my-2 w-full mt-5'>
          <div className="text-slate-500 text-lg uppercase font-black mb-4">
            verified status
          </div>
          <div className='w-full flex flex-row w-full items-center justify-center'>
            {verifiedBadge('kyc',connectedOwnsNFT)}
            {verifiedBadge('wallet',connectedOwnsNFT)}
            {verifiedBadge('token',connectedOwnsNFT)}
          </div>      
        </div>  
        {children}
      </div>

      
    </div>
  )
}
