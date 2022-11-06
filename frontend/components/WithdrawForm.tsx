import { Button, Link, Spinner, Text, useToast } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { useAccount } from 'wagmi'
import { Ethereum } from 'cryptocons'
import { LoaderBar } from './LoaderBar'
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid'
import {
  useGetERC20Balance,
  useGetWrappedBalance,
  useWithdraw,
} from '../hooks/useWithdrawFlow'

// const GOERLI_CONTRACT_ADDRESS = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
const MOCK_TOKEN = '0xf38d32C01233eDAF3b61DAaD0eb598521688C3C6'
const WRAPPED_TOKEN_ADDRESS = '0x02052ABEC1ccc18093022b6b648b9754201C7D5f'

function getFirstAndLast5LettersFromString(str: string) {
  return str.substring(0, 5) + '...' + str.substring(str.length - 5, str.length)
}

export const WithdrawForm = ({ props }: any): any => {
  const [amount, setAmount] = useState(0)
  const { address } = useAccount()
  const handleChange = (e: any) => {
    const x = Number.parseFloat(e.target.value)
    setAmount(Number.isNaN(x) ? 0 : x)
  }
  const toast = useToast()

  const wrappedBalance = useGetWrappedBalance(address as any, MOCK_TOKEN)
  const unwrappedBalance = useGetERC20Balance(address as any, MOCK_TOKEN)

  console.log("Here's my wrappedBalance")
  console.log(wrappedBalance)
  console.log("Here's my unwrapped balance")
  console.log(unwrappedBalance)

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

  const hasEnough = wrappedBalance !== undefined && wrappedBalance >= amount
  const { isLoading, write, error } = useWithdraw(
    address as any,
    amount,
    hasEnough,
    onTxnSuccess,
    onError
  )

  const submit = useCallback(async () => {
    await write?.()
  }, [write])

  if (!wrappedBalance) {
    return null
  }

  //'https://goerli.etherscan.io/address/0xf38d32C01233eDAF3b61DAaD0eb598521688C3C6'
  // isLoading = true
  return (
    <div className="bg-blue-600 p-4 rounded-md my-2 w-full mt-4">
      {(!isLoading && (
        <div className="text-blue-400 text-lg uppercase font-black">
          balance{' '}
        </div>
      )) || (
        <div className="text-blue-400 text-lg uppercase font-black">
          withdrawing...{' '}
        </div>
      )}
      {!isLoading && (
        <>
          <div className="text-white text-4xl font-bold flex flex-row">
            <div className='flex flex-col'>
              <div>
                <span className="text-blue-800">$</span>
                {wrappedBalance} wrapped
              </div>
              
              {/* Unwrapped balance */}
              <div className="text-blue-400 text-lg font-bold flex flex-row">
                <span className="text-blue-800">$</span>
                {unwrappedBalance} unwrapped
              </div>
            </div>
            
            {}
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://goerli.etherscan.io/address/${MOCK_TOKEN}`}
            >
              <div className="ml-4 text-sm outline-4 hover:outline outline-black bg-blue-900 p-2 rounded-md text-white flex flex-row w-fit items-center">
                <Ethereum />
                {getFirstAndLast5LettersFromString(MOCK_TOKEN)}
              </div>
            </a>
          </div>
          <div className="p-4 w-full flex flex-row items-center content-center align-center justify-center">
            {/* <button
              disabled={!hasEnough}
              className="outline-4 hover:outline outline-blue-800 p-2 px-8 flex flex-row items-center text-lg rounded-xl text-black bg-white m-4"
              onClick={() => {
                setAmount(wrappedBalance)
                submit()
              }}
            >
              <ArrowUpTrayIcon className="w-12 p-3"></ArrowUpTrayIcon>withdraw
              ALL
            </button> */}
            <div className='flex flex-row outline-4 hover:outline outline-blue-800  p-2 px-8 flex flex-row items-center text-lg rounded-xl text-black bg-blue-500 m-4'>
              <span className='flex text-blue-400 text-lg'>$</span>
                <input
                  disabled={!hasEnough}
                  className="bg-transparent text-white text-2xl w-32 outline-none placeholder-blue-300"
                  placeholder={'max: $'+wrappedBalance}
                  type='number'
                  onChange={(e) => {
                    setAmount(Math.min(wrappedBalance,Number(e.target.value || 0)))
                  }}
                />
                
            </div>
            <button className='bg-white rounded-xl text-black flex flex-row items-center px-4' onClick={(e)=>{
              e.preventDefault()
              submit()
            }}>
              <ArrowUpTrayIcon className="w-12 p-3 text-black"></ArrowUpTrayIcon>
              <span className=''>withdraw</span>
            </button>
            
            
          </div>
        </>
      )}

      {isLoading && (
        <>
          <div className="p-4 w-full h-full flex flex-row items-center content-center align-center justify-center">
            <LoaderBar loading={true}></LoaderBar>
          </div>
          {/* <div className='w-full flex items-center p-4'>  </div> */}
          <p>
            unwrapping amd sending {amount} of {MOCK_TOKEN} to{' '}
            <strong>{address}</strong>
          </p>
        </>
      )}
    </div>
  )
}
