import { Button, Input, Link, Spinner, Text, useToast } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import type { NextPage } from 'next'
import { useState } from 'react'
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  erc20ABI,
} from 'wagmi'
import { Layout } from '../components/layout/Layout'

const GOERLI_CONTRACT_ADDRESS = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'

const Home: NextPage = () => {
  const [amount, setAmount] = useState(0)
  const toast = useToast()

  let bigNumberAmount: BigNumber | undefined = undefined
  try {
    bigNumberAmount = BigNumber.from(amount)
  } catch (e) {}

  const validBigNumber = bigNumberAmount !== undefined
  console.log(`valid bigNumber? ${validBigNumber}`)

  const { config } = usePrepareContractWrite({
    address: GOERLI_CONTRACT_ADDRESS,
    abi: erc20ABI,
    functionName: 'transfer',
    args: [
      '0xf34a9b1F6286be9210105b23C608d39C54124B06',
      bigNumberAmount as BigNumber,
    ],
    enabled: validBigNumber,
  })
  const { data, write } = useContractWrite(config)
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      console.log('success data', data)
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
    },
  })

  const handleAmountChange = (event: any) => {
    setAmount(event.target.value)
  }

  return (
    <Layout>
      <Input
        isInvalid={!validBigNumber}
        errorBorderColor="red.300"
        value={amount}
        onChange={handleAmountChange}
        placeholder="0"
        size="md"
        marginBottom={10}
      />{' '}
      <Button
        disabled={!write}
        onClick={() => {
          write?.()
        }}
      >
        {isLoading ? <Spinner /> : 'Transfer'}
      </Button>
    </Layout>
  )
}

export default Home
