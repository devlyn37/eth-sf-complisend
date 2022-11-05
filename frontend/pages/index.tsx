import { Heading, Link, Text, useToast } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useState } from 'react'
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import YourContract from '../artifacts/contracts/YourContract.sol/YourContract.json'
import { Layout } from '../components/layout/Layout'

const GOERLI_CONTRACT_ADDRESS = '0x3B73833638556f10ceB1b49A18a27154e3828303'

/**
 * Prop Types
 */
type StateType = {
  greeting: string
  inputValue: string
}

/**
 * Component
 */
const initialState: StateType = {
  greeting: '',
  inputValue: '',
}

const Home: NextPage = () => {
  const [state, setState] = useState(initialState)
  const toast = useToast()

  const { config } = usePrepareContractWrite({
    address: GOERLI_CONTRACT_ADDRESS,
    abi: YourContract.abi as [any],
    functionName: 'setGreeting',
    args: [state.inputValue],
    enabled: Boolean(state.inputValue),
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
            <Text>Successfully updated the Greeting!</Text>
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
  return (
    <Layout>
      <Heading>Home Page</Heading>
    </Layout>
  )
}

export default Home
