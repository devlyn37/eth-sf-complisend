// WETH in Goerli
// const GOERLI_CONTRACT_ADDRESS = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
const MOCK_TOKEN = '0xf38d32C01233eDAF3b61DAaD0eb598521688C3C6'
const WRAPPED_TOKEN_ADDRESS = '0x02052ABEC1ccc18093022b6b648b9754201C7D5f'
const WRAPPED_TOKEN_ABI = require('../artifacts/contracts/WrappedToken.sol/WrappedToken.json')

import { ethers } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

export function useGetBalance(tokenContract: string, account: string) {
  const { data: balance } = useContractRead({
    address: MOCK_TOKEN,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          [
            { internalType: 'address', name: 'account', type: 'address' },
            { internalType: 'uint256', name: 'id', type: 'uint256' },
          ],
        ],
        outputs: [],
      },
    ],
    functionName: 'balanceOf',
    args: [account, tokenContract],
    watch: true,
  })

  return balance
}

export function useWithdraw(
  recipient: string,
  amount: number,
  enabled: boolean,
  onSuccess: (data: ethers.providers.TransactionReceipt) => void,
  onError: (err: any) => void
) {
  const { config } = usePrepareContractWrite({
    address: WRAPPED_TOKEN_ADDRESS,
    abi: WRAPPED_TOKEN_ABI.abi,
    functionName: 'releaseERC20',
    args: [
      // token Address
      MOCK_TOKEN,
      // to
      recipient,
      // amount
      parseEther(amount.toString()),
      // data
      ethers.utils.toUtf8Bytes('transfer'),
    ],
    enabled: enabled,
    staleTime: 5000,
  })
  const { data, write, error } = useContractWrite(config as any)
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onError,
    onSuccess,
  })

  return { isLoading, data, write, error }
}
