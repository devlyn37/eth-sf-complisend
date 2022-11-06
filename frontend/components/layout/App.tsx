// import { Container, Flex, Link, SimpleGrid, Text } from '@chakra-ui/react'
import React, { useState, useCallback, useContext } from 'react'
import { Head, MetaProps } from './Head'
import { Button, Link, Text, useToast } from '@chakra-ui/react'
import XmtpContext from '../../context/xmtp'
import { SetNotesForm, SetRecieverForm, SetTokenForm } from '../form'
import { OverlayDialog } from '../OverlayDialog'
import { LoaderBar } from '../LoaderBar'
import { useSendFlow } from '../../hooks/useSendFlow'
import { useGetBalance, useWithdraw } from '../../hooks/useWithdrawFlow'
import { getAddress } from 'ethers/lib/utils'
import { useAccount } from 'wagmi'

// const GOERLI_CONTRACT_ADDRESS = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
const MOCK_TOKEN = '0xf38d32C01233eDAF3b61DAaD0eb598521688C3C6'
const WRAPPED_TOKEN_ADDRESS = '0x02052ABEC1ccc18093022b6b648b9754201C7D5f'

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
  const { initClient, sendMessage, client } = useContext(XmtpContext)
  const toast = useToast()

  const onTxnSuccess = (data: any) => {
    console.log('success data', data)
    toast({
      title: 'Transaction Successful',
      description: (
        <>
          <Text>Transfer Successful</Text>
          <Text>
            <Link
              href={`https://goerli.etherscan.io/tx/${data?.transactionHash}`}
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
  }

  const onLockSuccess = async (data: any) => {
    onTxnSuccess(data)
    await Promise.all([
      sendMessage(
        JSON.stringify({
          hash: data.transactionHash,
          note: note,
          recipient: getAddress(recipient),
        }),
        getAddress(recipient)
      ),
      sendMessage(
        JSON.stringify({
          hash: data.transactionHash,
          note: note,
          recipient: getAddress(recipient),
        }),
        AUDITOR_ETH_ADDRESS
      ),
    ])
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

  const { isLoading, write, state } = useSendFlow(
    recipient,
    amount,
    onTxnSuccess,
    onError,
    onLockSuccess,
    onError
  )

  const submit = useCallback(async () => {
    if (!client) {
      await initClient()
    }

    await write?.()
  }, [write])

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
            {state}
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

const WithdrawForm = ({ props }: any): any => {
  const [amount, setAmount] = useState(0)
  const { address } = useAccount()
  const handleChange = (e: any) => {
    const x = Number.parseFloat(e.target.value)
    setAmount(Number.isNaN(x) ? 0 : x)
  }

  const balance = useGetBalance(address as any, MOCK_TOKEN)
  console.log("Here's my balance")
  console.log(balance)

  return (
    <div className="bg-slate-900 p-4 rounded-md my-2">
      <div className="text-slate-600 text-sm uppercase font-black">
        withdraw
      </div>
      <div className="flex flex-col">
        amount
        <input
          className="bg-slate-800 p-6 text-lg"
          onChange={handleChange}
          value={amount}
        ></input>
      </div>
      <p>
        sending and unwrapping to <strong>{address}</strong>
      </p>
      <div className="flex-center p-4">
        <button className="bg-blue-500 p-4 rounded-md font-bold">
          <span>widthdraw</span>
        </button>
      </div>
    </div>
  )
}

const AUDITOR_ETH_ADDRESS = '0x9A8766D4A7C9bb69E536A5cAB873CeA647bE1dD8'
import { Layout } from './Layout'

export const App = ({ customMeta }: LayoutProps): JSX.Element => {
  return (
    <Layout>
      <Head customMeta={customMeta} />
      <header className="w-full h-full overflow-y-scroll text-white min-h-screen p-2">
        <div className="flex flex-col items-center">
          <WithdrawForm />
          <SubmitForm />
          <div className="p-4"></div>
        </div>
      </header>
    </Layout>
  )
}
