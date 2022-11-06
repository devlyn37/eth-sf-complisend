import { Button, Link, Text, useToast } from '@chakra-ui/react'
import { getAddress } from 'ethers/lib/utils'
import { useCallback, useContext, useState } from 'react'
import XmtpContext from '../context/xmtp'
import { useCheckOwnership } from '../hooks/useCheckOwnership'
import { useSendFlow } from '../hooks/useSendFlow'
import { SetNotesForm, SetRecieverForm, SetTokenForm } from './form'
import { LoaderBar } from './LoaderBar'
import { OverlayDialog } from './OverlayDialog'
import { ImageUpload } from './ImageUpload'

const AUDITOR_ETH_ADDRESS = '0x9A8766D4A7C9bb69E536A5cAB873CeA647bE1dD8'

export const Sendform = ({ props }: any): any => {
  const [token_state, setTokenState] = useState({ amount: 0 })
  const [reciever_state, setRecieverState] = useState({ address: '' })
  const [notes_state, setNotesState] = useState({ notes: '' })
  const [image_state, setImageState] = useState({ ipfs: '' })

  const recipient = reciever_state.address
  const amount = token_state.amount
  const note = notes_state.notes
  const { initClient, sendMessage, client } = useContext(XmtpContext)
  const toast = useToast()

  let formattedRecipientAddress: string | undefined
  try {
    formattedRecipientAddress = getAddress(recipient)
  } catch (e) {
    formattedRecipientAddress = undefined
  }

  const ownsNFT = useCheckOwnership(formattedRecipientAddress)
  console.log(ownsNFT)

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
      <div className="bg-slate-800 p-4 rounded-md my-2 w-full">
        <div className="text-green-400 text-lg uppercase font-black">send</div>
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
        <div className="m-2">
          <ImageUpload onSet={setImageState}></ImageUpload>
        </div>

        <div className="w-full p-4 flex items-center justify-center">
          <div>{`recipient owns NFT: ${ownsNFT}`}</div>
          <Button
            disabled={!write || isLoading}
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
