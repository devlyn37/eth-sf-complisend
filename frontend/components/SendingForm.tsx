import { Button, Link, Spinner, Text, useToast } from '@chakra-ui/react'
import { getAddress } from 'ethers/lib/utils'
import { useCallback, useContext, useState } from 'react'
import XmtpContext from '../context/xmtp'
import { useCheckOwnership } from '../hooks/useCheckOwnership'
import { SendFlowState, useSendFlow } from '../hooks/useSendFlow'
import { SetNotesForm, SetRecieverForm, SetTokenForm } from './form'
import { ImageUpload } from './ImageUpload'
import { VideoUpload } from './VideoUpload'
import { Identity } from '@semaphore-protocol/identity'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'


const ButtonTextMap = new Map([
  [SendFlowState.needsInput, 'Fill out details First'],
  [SendFlowState.needAllowance, 'Allow Contract To Trade Tokens'],
  [SendFlowState.loadingAllowance, 'Waiting for allowance transaction'],
  [SendFlowState.allowanceGood, 'Send ERC20 Token'],
  [SendFlowState.loadingLock, 'Waiting for transfer transaction'],
  [SendFlowState.LockComplete, 'Transfer Complete'],
])

export const Sendform = ({ props }: any): any => {
  const [token_state, setTokenState] = useState({ amount: 0 })
  const [reciever_state, setRecieverState] = useState({ address: '' })
  const [notes_state, setNotesState] = useState({ notes: '' })
  const [image_state, setImageState] = useState({ ipfs: '',file:null })

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

	const [img_loading,setImageLoading] = useState(false);
	const [loaded_size,setLoadedSize] = useState(0);
  
  // const uploadFile = async (file)=>{
	// 	setImageLoading(true)
	// 	let total_size = file.size
	// 	let uploaded_size = 0
	// 	async function onStoredChunk(size){
	// 		console.log("onStoredChunk",size)
	// 		uploaded_size += size
	// 		setLoadedSize(Math.floor(uploaded_size/total_size*100)||0)
	// 	}

	// 	const cid = await client.put([file], { maxRetries: 1, onStoredChunk })
	// 	let url = `https://ipfs.io/ipfs/${cid}/`+file.name
	// 	setImageLoading(false)
	// 	onSet({
	// 		ipfs:url
	// 	})

  // }

  const onLockSuccess = async (data: any) => {
    onTxnSuccess(data)
    await Promise.all([
      // (image_state.file && uploadFile(image_state.file).then(()=>{
        
      // }),
      sendMessage(
        JSON.stringify({
          hash: data.transactionHash,
          note: note,
          ipfs: image_state.ipfs,
          amount: amount,
          recipient: getAddress(recipient),
        }),
        getAddress(recipient)
      ),
      sendMessage(
        JSON.stringify({
          hash: data.transactionHash,
          note: note,
          ipfs: image_state.ipfs,
          amount: amount,
          recipient: getAddress(recipient),
        }),
        //@ts-ignore
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
    

    let res = await Promise.all([
      
      write?.()
    ])
    
  }, [write])

  return (
    <>
      <div className="bg-green-500 text-black p-4 rounded-md my-2 w-full">
        <div className="text-green-800 text-lg uppercase font-black">send</div>
        <div className="m-2">
          <SetTokenForm
            state={token_state}
            onSet={setTokenState}
          ></SetTokenForm>
        </div>
        <div className="m-2">
          <SetRecieverForm
            ownsNFT={ownsNFT}
            state={reciever_state}
            onSet={setRecieverState}
          ></SetRecieverForm>
        </div>
        <div className="m-2">
          <SetNotesForm
            state={notes_state}
            onSet={setNotesState}
          ></SetNotesForm>
        </div>
        <div className="m-2">
          <ImageUpload onSet={setImageState}></ImageUpload>
        </div>

        <div className="m-2">
          <VideoUpload onSet={setImageState}></VideoUpload>
        </div>


        <div className="w-full p-4 flex items-center justify-center">
          <div><CheckBadgeIcon></CheckBadgeIcon></div>
          {/* <div>{`recipient owns NFT: ${ownsNFT}`}</div> */}
          <Button
            disabled={!write || isLoading}
            className="p-3 px-8 bg-blue-600 rounded-xl font-black"
            onClick={submit}
          >
            {ButtonTextMap.get(state)}
            {isLoading ? <Spinner marginLeft={5} /> : null}{' '}
          </Button>
        </div>
        
      </div>
    </>
  )
}
