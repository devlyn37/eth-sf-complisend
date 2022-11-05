// import { Container, Flex, Link, SimpleGrid, Text } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import React, {
  useState,
  Fragment,
  useCallback,
  useMemo,
  useContext,
} from 'react'
import { Head, MetaProps } from './Head'
import cn from 'classnames'
import { Dialog, Transition } from '@headlessui/react'
import { Link, Text, useToast } from '@chakra-ui/react'
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

export function OverlayDialog({
  children,
  show,
  onClose = () => {},
  onSubmit = () => {},
}: any) {
  // console.log(error)
  return (
    <Dialog open={show} onClose={onClose}>
      <div
        className="fixed inset-0 left-0  z-20 top-0 w-screen h-screen bg-slate-900/90"
        aria-hidden="true"
      />
      <Transition
        show={show}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
        as={Fragment}
      >
        <div className="fixed inset-0 left-0 top-0 w-screen h-screen flex items-center justify-center z-30 ">
          <Dialog.Panel className="mx-auto h-fit w-96 p-4 text-slate-200">
            {children}
            <div className="p-2 w-full flex items-center justify-center flex-row">
              <button
                className="bg-blue-500 rounded-md p-2 px-4 m-4"
                onClick={onSubmit}
              >
                submit
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Transition>
    </Dialog>
  )
}

const SetTokenForm = ({ state, onSet }: any): any => {
  const [amount, setAmount] = useState(0)
  const [open_form, setFormOpen] = useState(false)

  const onSetAmountChange = (e: any) => {
    setAmount(e.target.value)
  }

  const onSubmit = (e: any) => {
    e.preventDefault()

    onSet({
      amount: amount,
    })
    setFormOpen(false)
  }

  return (
    <>
      <OverlayDialog
        show={open_form}
        onSubmit={onSubmit}
        onClose={setFormOpen.bind(null, false)}
      >
        <div className="p-2">set amount</div>
        <input
          className="bg-slate-800 p-6 text-lg"
          onChange={onSetAmountChange}
          value={amount}
        ></input>
      </OverlayDialog>
      <div
        className="rounded-md p-4 bg-slate-700 cursor-pointer"
        onClick={setFormOpen.bind(null, true)}
      >
        {!amount ? 'set amount' : amount}
      </div>
    </>
  )
}

const SetNotesForm = ({ state, onSet }: any): any => {
  const [notes, setNotes] = useState(0)
  const [open_form, setFormOpen] = useState(false)

  const onSetNotesChange = (e: any) => {
    setNotes(e.target.value)
  }

  const onSubmit = (e: any) => {
    e.preventDefault()

    onSet({
      notes: notes,
    })
    setFormOpen(false)
  }

  return (
    <>
      <OverlayDialog
        show={open_form}
        onSubmit={onSubmit}
        onClose={setFormOpen.bind(null, false)}
      >
        <div className="p-2">set notes</div>
        <textarea
          className="bg-slate-800 p-6 text-lg"
          onChange={onSetNotesChange}
          value={notes}
          placeholder="set notes"
        ></textarea>
      </OverlayDialog>
      <div
        onClick={setFormOpen.bind(null, true)}
        className="rounded-md p-4 bg-slate-800 cursor-pointer"
      >
        {!notes ? 'set notes' : notes}
      </div>
    </>
  )
}

{
  /* let [addr,setAddr] = useState('')
  
let onAddrChange = function(e:any){
  setAddr(e.target.value)
} */
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

const SetRecieverForm = ({ state = {}, onSet }: any): any => {
  const [address, setAddress] = useState(0)
  const [open_form, setFormOpen] = useState(false)

  const onSetAddressChange = (e: any) => {
    setAddress(e.target.value)
  }

  const onSubmit = (e: any) => {
    e.preventDefault()
    // console.log('submit')
    onSet({
      address: address,
    })
    setFormOpen(false)
  }

  return (
    <>
      <OverlayDialog
        show={open_form}
        onSubmit={onSubmit}
        onClose={setFormOpen.bind(null, false)}
      >
        <div className="p-2">set reciever</div>
        <input
          className="bg-slate-800 p-6 text-lg"
          onChange={onSetAddressChange}
          value={address}
          placeholder="select address"
        ></input>
      </OverlayDialog>
      <div
        onClick={setFormOpen.bind(null, true)}
        className="rounded-md p-4 bg-slate-800 cursor-pointer"
      >
        {!address ? 'select address' : address}
      </div>
    </>
  )
}

export function LoaderBar({ loading }: any) {
  let loader_bar_cn = cn({
    'rounded-md h-3 bg-black/20 search-loader-bar overflow-hidden': true,
    'w-6': !loading,
    'w-12': loading,
  })

  let loader_dot_cn = cn({
    'rounded-md h-3 transition-transform': true,
    'w-3 bg-black/0': !loading,
    'w-4 bg-white search-loader-dot-active': loading,
  })

  return (
    <div className="flex items-center justify-center">
      <div className={loader_bar_cn}>
        <div className={loader_dot_cn}></div>
      </div>
    </div>
  )
}

const SubmitForm = ({ props }: any): any => {
  let [token_state, setTokenState] = useState({})
  let [reciever_state, setRecieverState] = useState({})
  let [notes_state, setNotesState] = useState({})

  let [is_sending, setIsSending] = useState(false)

  let submitTransaction = function () {
    // combine token_state & notes_state and submit
  }

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
          <button
            className="p-3 px-8 bg-blue-600 rounded-xl font-black"
            onClick={submitTransaction}
          >
            SEND
          </button>
        </div>
      </div>
      <OverlayDialog show={false}>
        <LoaderBar> </LoaderBar>
        <div className="p-2">sending....</div>
      </OverlayDialog>
    </>
  )
}

const Trx = ({ props }: any): any => {
  return (
    <div className="flex p-2 rounded-md bg-slate-900 m-2">trx goes here</div>
  )
}

const TrxList = ({ props }: any): any => {
  const [filter, setFilter] = useState('sent')

  let trx_list: any = []

  return (
    <div>
      <div className="flex flex-row rounded-xl font-black bg-blue-500 m-2 overflow-hidden items-stretch content-stretch cursor-pointer">
        <div
          onClick={setFilter.bind(null, 'sent')}
          className={
            'h-full p-2 px-5 ' +
            cn({
              'bg-slate-700': filter != 'sent',
              'bg-blue-500': filter == 'sent',
            })
          }
        >
          sent
        </div>
        <div
          onClick={setFilter.bind(null, 'received')}
          className={
            'h-full p-2 px-5 ' +
            cn({
              'bg-slate-700': filter != 'received',
              'bg-blue-500': filter == 'received',
            })
          }
        >
          recieved
        </div>
      </div>
      {trx_list}
    </div>
  )
}

export const App = ({ customMeta }: LayoutProps): JSX.Element => {
  // merging

  const { address } = useAccount()
  const [amount, setAmount] = useState(0)
  const [recipient, setRecipient] = useState('')
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

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    async onSuccess(data) {
      console.log('success data', data)

      if (!client) {
        throw new Error('Did not sign xmtp messages')
      }

      const conversation = await client?.conversations.newConversation(
        getAddress(recipient)
      )
      const result = await conversation.send(`hash: ${data.transactionHash}`)
      console.log(result)
      toast({
        title: 'Transaction Successful',
        description: (
          <>
            <Text>Transfered the WETH</Text>
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

      setRecipient('')
      setAmount(0)
    },
  })

  const handleRecipientChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRecipient(event.target.value)
    },
    []
  )

  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const x = Number.parseFloat(event.target.value)

      setAmount(Number.isNaN(x) ? 0 : x)
    },
    []
  )

  const onClick = useCallback(async () => {
    // TODO queue these all at once somehow
    await initClient()
    await write?.()
  }, [write, initClient])

  // end merging

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
            <TrxList />
          </div>
        </div>
      </header>
    </>
  )
}
