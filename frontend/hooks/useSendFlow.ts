import { BigNumber, ethers } from 'ethers'
import { useMemo } from 'react'
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
const WRAPPED_TOKEN_ABI = require('../../artifacts/contracts/WrappedToken.sol/WrappedToken.json')

// WETH in Goerli
// const GOERLI_CONTRACT_ADDRESS = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
const MOCK_TOKEN = '0xf38d32C01233eDAF3b61DAaD0eb598521688C3C6'
const WRAPPED_TOKEN_ADDRESS = '0x02052ABEC1ccc18093022b6b648b9754201C7D5f'

export function useSendFlow(
  recipient: string,
  amount: number,
  onSuccess: (data: ethers.providers.TransactionReceipt) => void,
  onError: (err: any) => void
) {
  const { address } = useAccount()
  const bigNumberAmount = useMemo(() => {
    try {
      return BigNumber.from(amount)
    } catch (e) {
      return undefined
    }
  }, [amount])

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

  const { config } = usePrepareContractWrite({
    address: WRAPPED_TOKEN_ADDRESS,
    abi: WRAPPED_TOKEN_ABI.abi,
    functionName: 'lockERC20',
    args: [
      // token Address
      MOCK_TOKEN,
      // from
      address,
      // to
      recipient,
      // amount
      BigNumber.from(amount),
      // data
      ethers.utils.toUtf8Bytes('transfer'),
    ],
    enabled: bigNumberAmount && recipient.length > 0 && validRecipient,
  })

  const { data, write, error } = useContractWrite(config as any)
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onError,
    onSuccess,
  })

  return { isLoading, data, write, error }
}
