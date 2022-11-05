import { Button, Input, Link, Spinner, Text, useToast } from '@chakra-ui/react'
import { BigNumber, ethers } from 'ethers'
import type { NextPage } from 'next'
import React, { useCallback, useMemo, useState, useContext } from 'react'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

import { App } from '../components/layout/App'
import XmtpContext from '../context/xmtp'


const WRAPPED_TOKEN_ABI = require('../artifacts/contracts/WrappedToken.sol/WrappedToken.json')

// WETH in Goerli
// const GOERLI_CONTRACT_ADDRESS = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'

const ERC20_TOKEN_MUMBAI = '0xf38d32C01233eDAF3b61DAaD0eb598521688C3C6'
const WRAPPED_TOKEN_ADDRESS = '0x02052ABEC1ccc18093022b6b648b9754201C7D5f'

const Home: NextPage = () => {
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
    args: [ERC20_TOKEN_MUMBAI],
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

  const { data, write } = useContractWrite(config as any)

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

  const onClick = useCallback(() => {
    write?.()
  }, [write])

  return (
    <App>
    </App>
  )
}

export default Home
