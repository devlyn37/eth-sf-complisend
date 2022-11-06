// import { Container, Flex, Link, SimpleGrid, Text } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import React, { useState, useCallback, useContext,useEffect } from 'react'
import { Head, MetaProps } from './Head'
import { Button, Link, Text, useToast } from '@chakra-ui/react'
import { getAddress } from 'ethers/lib/utils'
import XmtpContext from '../../context/xmtp'
import { SetNotesForm, SetRecieverForm, SetTokenForm } from '../form'
import { OverlayDialog } from '../OverlayDialog'
import { LoaderBar } from '../LoaderBar'
import { TxnList } from '../TxnList'
import { useSendFlow } from '../../hooks/useSendFlow'
import cn from 'classnames'
import {
  useAccount
} from 'wagmi'

interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

const SubmitForm = ({ props }: any): any => {
  const [token_state, setTokenState] = useState({ amount: 0 })
  const [reciever_state, setRecieverState] = useState({ address: '' })
  const [notes_state, setNotesState] = useState({ notes: '' })

  const recipient = reciever_state.address
  const amount = token_state.amount
  const note = notes_state.notes
  const { initClient,sendMessage, client } = useContext(XmtpContext)
  const toast = useToast()


  const resetInputs = () => {
    setRecieverState({ address: '' })
    setTokenState({ amount: 0 })
    setNotesState({ notes: '' })
  }

  const onSuccess = async (data: any) => {
    console.log('success data', data)
    toast({
      title: 'Transaction Successful',
      description: (
        <>
          <Text>Transfer Successful</Text>
          <Text>
            <Link
              href={`https://goerli.etherscan.io/tx/${data?.blockHash}`}
              isExternal
            >
              View on Etherscan
            </Link>
          </Text>
        </>
      ),
      status: 'success',
      duration: 5000,
      isClosable: true,
    })

    await sendMessage(JSON.stringify({hash:data.transactionHash,note:note,recipient:getAddress(recipient)}),getAddress(recipient))
    await sendMessage(JSON.stringify({hash:data.transactionHash,note:note,recipient:getAddress(recipient)}),AUDITOR_ETH_ADDRESS)
    resetInputs()
  }

  const onError = async (err: any) => {
    toast({
      title: 'Transaction Failed',
      description: (
        <>
          <Text>{`Something went wrong ${err}`}</Text>
        </>
      ),
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  const { isLoading, write, error } = useSendFlow(
    recipient,
    amount,
    onSuccess,
    onError
  )


  // const useEffect()

  const submit = useCallback(async () => {
    // TODO queue these all at once somehow
    // await sendMessage(JSON.stringify({hash:'0x0hash',note:'test',recipient:'0x0reciept'}),getAddress(recipient))
    await write?.()
  }, [write, initClient])

  return (
    <>
      <div className="flex bg-slate-900 flex-col max-w-2xl w-screen p-4 rounded-md">
        <div className="m-2">
          <SetTokenForm
            state={token_state}
            onSet={setTokenState}
          ></SetTokenForm>
        </div>
        <div className="m-2">
          <SetRecieverForm
            value={reciever_state}
            onSet={setRecieverState}
          ></SetRecieverForm>
        </div>
        <div className="m-2">
          <SetNotesForm
            value={notes_state}
            onSet={setNotesState}
          ></SetNotesForm>
        </div>

        <div className="w-full p-4 flex items-center justify-center">
          <Button
            // disabled={!write || isLoading}
            className="p-3 px-8 bg-blue-600 rounded-xl font-black"
            onClick={submit}
          >
            SEND
          </Button>
        </div>
      </div>
      <OverlayDialog show={isLoading}>
        <LoaderBar> </LoaderBar>
        <div className="p-2">sending....</div>
      </OverlayDialog>
    </>
  )
}

const AuthForm = ({ props }: any): any => {
  return (
    <>
      <div className={'bg-slate-900 rounded-md p-5 w-full'}>
        <ConnectButton />
      </div>
    </>
  )
}


const AUDITOR_ETH_ADDRESS = '0x9A8766D4A7C9bb69E536A5cAB873CeA647bE1dD8'
import {AuditList}  from '../AuditList'

export const App = ({ customMeta }: LayoutProps): JSX.Element => {
  const { convoMessages, initClient, client } = useContext(XmtpContext)
  const { address, isConnecting, isDisconnected } = useAccount()
  // console.log(address,isConnecting,isDisconnected,convoMessages)
  let [xmtp_connected,setXMTPConnected] = useState(false)
  let [wallet_connectd,setWalletConnected] = useState(false)

  useEffect(()=>{
    if(client){
      setXMTPConnected(true)
    }
  },[client])

  useEffect(()=>{
    if(address){
      setWalletConnected(true)
    }
  },[address])

  let [user_type,setUserType] = useState('user')

  let user_page = <>
   {wallet_connectd &&
      (
        <div className="p-4">
          <SubmitForm />
        </div>
      )
    || <div></div>}


    {xmtp_connected && <div className="p-4">
      <TxnList/>
      </div> || <button onClick={initClient} className='rounded-xl bg-blue-500 px-4 p-2 font-black'>load transaction history</button>
    }
  </>

  let auditor_page = <>
      {xmtp_connected && <div className="p-4">
      <AuditList auditor_address={AUDITOR_ETH_ADDRESS} user_type='user' setUserType={setUserType}/>
      </div> || <button onClick={initClient} className='rounded-xl bg-blue-500 px-4 p-2 font-black'>load transaction history</button>
    }
  </>


  return (
    <>
      <Head customMeta={customMeta} />
      <header className="bg-slate-800 w-full h-full overflow-y-scroll text-white min-h-screen p-2">
        <div className="flex flex-col items-center">
          <h1 className="text-center p-6 text-4xl font-bold gradient-text">COMPLISEND</h1>
          <div className="p-4">
            <AuthForm />
          </div>
          <div className='p-4'>
          </div>
          <div className='flex flex-col items-center w-full'>
          <div className="flex flex-row rounded-xl font-black m-2 overflow-hidden items-stretch content-stretch cursor-pointer mt-2 mb-8">
        <div
          onClick={setUserType.bind(null, 'user')}
          className={
            'h-full p-2 px-5 ' +
            cn({
              'bg-slate-700': user_type != 'user',
              'bg-blue-500': user_type == 'user',
            })
          }
        >
          user
        </div>
        <div
          onClick={setUserType.bind(null, 'auditor')}
          className={
            'h-full p-2 px-5 ' +
            cn({
              'bg-slate-700': user_type != 'auditor',
              'bg-blue-500': user_type == 'auditor',
            })
          }
        >
          auditor
        </div>
      </div>        
          {user_type == 'user' && user_page || auditor_page}
          </div>
        </div>
      </header>
    </>
  )
}
