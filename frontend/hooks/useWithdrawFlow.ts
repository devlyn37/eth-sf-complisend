// WETH in Goerli
// const GOERLI_CONTRACT_ADDRESS = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
const MOCK_TOKEN = '0xf38d32C01233eDAF3b61DAaD0eb598521688C3C6'
const WRAPPED_TOKEN_ADDRESS = '0x02052ABEC1ccc18093022b6b648b9754201C7D5f'
const WRAPPED_TOKEN_ABI = require('../artifacts/contracts/WrappedToken.sol/WrappedToken.json')
const ABI_1155 = require('../artifacts/@openzeppelin/contracts/token/ERC1155/ERC1155.sol/ERC1155.json')

import { BigNumber, ethers } from 'ethers'
import { formatEther, parseEther } from 'ethers/lib/utils'
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

export function useGetBalance(account: string, tokenContract: string) {
  const { data: balance, error } = useContractRead({
    address: WRAPPED_TOKEN_ADDRESS,
    abi: ABI_1155.abi,
    functionName: 'balanceOf',
    args: [account, tokenContract],
    watch: true,
  })

  console.log("Here's the error")
  console.log(error)

  return parseFloat(formatEther(balance as BigNumber))
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
