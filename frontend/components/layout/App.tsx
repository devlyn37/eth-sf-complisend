// import { Container, Flex, Link, SimpleGrid, Text } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import React, { useState, useCallback, useMemo, useContext } from 'react'
import { Head, MetaProps } from './Head'
import { Button, Link, Text, useToast } from '@chakra-ui/react'
import { getAddress } from 'ethers/lib/utils'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { BigNumber, ethers } from 'ethers'
import XmtpContext from '../../context/xmtp'
import { SetNotesForm, SetRecieverForm, SetTokenForm } from '../form'
import { OverlayDialog } from '../OverlayDialog'
import { LoaderBar } from '../LoaderBar'
import { TxnList } from '../TxnList'
const WRAPPED_TOKEN_ABI = require('../../artifacts/contracts/WrappedToken.sol/WrappedToken.json')

// WETH in Goerli
// const GOERLI_CONTRACT_ADDRESS = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
const MOCK_TOKEN = '0xf38d32C01233eDAF3b61DAaD0eb598521688C3C6'
const WRAPPED_TOKEN_ADDRESS = '0x02052ABEC1ccc18093022b6b648b9754201C7D5f'

interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

const LoadingOverlay = ({ props }: any): any => {
  ;<div className="fixed bg-slate-900 w-full h-full text-white min-h-screen p-2">
    loading
  </div>
}

const SubmitForm = ({ props }: any): any => {
  const [token_state, setTokenState] = useState({ amount: 0 })
  const [reciever_state, setRecieverState] = useState({ address: '' })
  const [notes_state, setNotesState] = useState({ notes: '' })

  const recipient = reciever_state.address
  const amount = token_state.amount
  const note = notes_state.notes
  // merging

  const { address } = useAccount()
  const { initClient, client } = useContext(XmtpContext)
  const toast = useToast()

  const bigNumberAmount = useMemo(() => {
    try {
      return BigNumber.from(amount)
    } catch (e) {
      return undefined
    }
  }, [amount])

  const validBigNumber = bigNumberAmount !== undefined
  console.log(`validBigNumber: ${validBigNumber}`)

  const validRecipient = useMemo(() => {
    if (recipient.length === 0) {
      return true
    }

    try {
      ethers.utils.getAddress(recipient)
      return true
    } catch (_err) {
      return false
    }
  }, [recipient])

  // Get Token ID in ERC1155 (WrappedToken) from original ERC20 token address
  const { data: erc20Id } = useContractRead({
    address: WRAPPED_TOKEN_ADDRESS,
    abi: WRAPPED_TOKEN_ABI.abi,
    functionName: 'erc20TokenID',
    args: [MOCK_TOKEN],
  })

  const { config } = usePrepareContractWrite({
    address: WRAPPED_TOKEN_ADDRESS,
    abi: WRAPPED_TOKEN_ABI.abi,
    functionName: 'safeTransferFrom',
    args: [
      // from
      address,
      // to
      recipient,
      // id
      erc20Id,
      // amount
      bigNumberAmount as BigNumber,
      // data
      ethers.utils.toUtf8Bytes('transfer'),
    ],
    enabled: validBigNumber && recipient.length > 0 && validRecipient,
  })

  const { data, write, error } = useContractWrite(config as any)
  console.log(error)

  const sendXMPTMessage = async (message: string) => {
    if (!client) {
      throw new Error('Did not sign xmtp messages')
    }

    const conversation = await client?.conversations.newConversation(
      getAddress(recipient)
    )
    const result = await conversation.send(message)
  }

  const resetInputs = () => {
    setRecieverState({ address: '' })
    setTokenState({ amount: 0 })
    setNotesState({ notes: '' })
  }

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onError(err) {
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
    },
    async onSuccess(data) {
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

      await sendXMPTMessage(`hash: ${data.transactionHash}, note: ${note}`)
      resetInputs()
    },
  })

  const submit = useCallback(async () => {
    // TODO queue these all at once somehow
    await initClient()
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
            disabled={!write || isLoading}
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
      <div className={'bg-slate-800 rounded-md p-5'}>
        <ConnectButton />
      </div>
    </>
  )
}

export const App = ({ customMeta }: LayoutProps): JSX.Element => {
  return (
    <>
      <Head customMeta={customMeta} />
      {/* <header> */}
      <header className="bg-slate-800 w-full h-full overflow-y-scroll text-white min-h-screen p-2">
        <div className="flex flex-col items-center">
          <h1 className="text-center p-6 text-4xl">COMPLISEND</h1>
          <div className="p-4">
            <AuthForm />
          </div>
          <div className="p-4">
            <SubmitForm />
          </div>
          <div className="p-4">
            <TxnList />
          </div>
        </div>
      </header>
    </>
  )
}
