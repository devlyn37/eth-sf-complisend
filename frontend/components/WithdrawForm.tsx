import { Button, Link, Spinner, Text, useToast } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { useAccount } from 'wagmi'
import { useGetBalance, useWithdraw } from '../hooks/useWithdrawFlow'

// const GOERLI_CONTRACT_ADDRESS = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
const MOCK_TOKEN = '0xf38d32C01233eDAF3b61DAaD0eb598521688C3C6'
const WRAPPED_TOKEN_ADDRESS = '0x02052ABEC1ccc18093022b6b648b9754201C7D5f'

export const WithdrawForm = ({ props }: any): any => {
  const [amount, setAmount] = useState(0)
  const { address } = useAccount()
  const handleChange = (e: any) => {
    const x = Number.parseFloat(e.target.value)
    setAmount(Number.isNaN(x) ? 0 : x)
  }
  const toast = useToast()

  const balance = useGetBalance(address as any, MOCK_TOKEN)
  console.log("Here's my balance")
  console.log(balance)

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

  const hasEnough = balance !== undefined && balance >= amount
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

  return (
    <div className="bg-slate-800 p-4 rounded-md my-2 w-full">
      <div className="text-blue-400 text-lg uppercase font-black">withdraw</div>
      <div className="text-white text-sm uppercase font-black">
        Current Balance {balance}
      </div>
      <div className="flex flex-col">
        amount
        <input
          className="bg-slate-700 p-6 text-lg rounded-lg"
          onChange={handleChange}
          value={amount}
        ></input>
      </div>
      <p>
        sending and unwrapping to <strong>{address}</strong>
      </p>
      <div className="flex-center p-4">
        <Button
          disabled={!hasEnough || !write || isLoading}
          className="p-3 px-8 bg-blue-600 rounded-xl font-black"
          onClick={submit}
        >
          {isLoading ? <Spinner /> : 'Withdraw'}
        </Button>
      </div>
    </div>
  )
}
