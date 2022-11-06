import { BigNumber, ethers } from 'ethers'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { useMemo } from 'react'
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
const WRAPPED_TOKEN_ABI = require('../artifacts/contracts/WrappedToken.sol/WrappedToken.json')

export enum SendFlowState {
  needsInput = `needsInput`,
  needAllowance = 'needAllowance',
  loadingAllowance = 'loadingAllowance',
  allowanceGood = 'allowanceGood',
  loadingLock = 'loadingLock',
  LockComplete = 'lockComplete',
}

// WETH in Goerli
// const GOERLI_CONTRACT_ADDRESS = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
const MOCK_TOKEN = '0xf38d32C01233eDAF3b61DAaD0eb598521688C3C6'
const WRAPPED_TOKEN_ADDRESS = '0x02052ABEC1ccc18093022b6b648b9754201C7D5f'

function useApprove(
  amount: number,
  enabled: boolean,
  onSuccess: (data: ethers.providers.TransactionReceipt) => void,
  onError: (err: any) => void
) {
  const { config } = usePrepareContractWrite({
    address: MOCK_TOKEN,
    abi: erc20ABI,
    functionName: 'approve',
    args: [WRAPPED_TOKEN_ADDRESS, parseEther(amount.toString())],
    enabled: enabled,
    staleTime: 5000,
  })
  const { data, write, error } = useContractWrite(config)
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onError,
    onSuccess,
  })

  return { isLoading, data, write, error }
}

function useLock(
  recipient: string,
  amount: number,
  from: string,
  enabled: boolean,
  onSuccess: (data: ethers.providers.TransactionReceipt) => void,
  onError: (err: any) => void
) {
  const { config } = usePrepareContractWrite({
    address: WRAPPED_TOKEN_ADDRESS,
    abi: WRAPPED_TOKEN_ABI.abi,
    functionName: 'lockERC20',
    args: [
      // token Address
      MOCK_TOKEN,
      // from
      from,
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

export function useSendFlow(
  recipient: string,
  amount: number,
  onAllowSuccess: (data: ethers.providers.TransactionReceipt) => void,
  onAllowError: (err: any) => void,
  onLockSuccess: (data: ethers.providers.TransactionReceipt) => void,
  onLockError: (err: any) => void
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

  const { data: allowance } = useContractRead({
    address: MOCK_TOKEN,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address as any, '0x02052abec1ccc18093022b6b648b9754201c7d5f'],
    watch: true,
  })

  // console.log(`allowance ${allowance && parseFloat(formatEther(allowance))}`)
  // console.log(`bigNumberAmount ${bigNumberAmount}`)
  // console.log(`amount ${bigNumberAmount?.toNumber()}`)
  // console.log(`recipient ${recipient}`)
  // console.log(`validRecipient ${validRecipient}`)

  const validInput =
    bigNumberAmount !== undefined && recipient.length > 0 && validRecipient
  // console.log(`validInput ${validInput}`)

  const allowedToSpend =
    allowance !== undefined && parseFloat(formatEther(allowance)) >= amount
  // console.log(`allowed to spend ${allowedToSpend}`)
  const canLock = validInput && allowedToSpend
  // console.log(`can lock ${canLock}`)

  const {
    isLoading: isLoadingAllow,
    data: dataAllow,
    write: writeAllow,
    error: errorAllow,
  } = useApprove(amount, validInput && !canLock, onAllowSuccess, onAllowError)

  const {
    isLoading: isLoadingLock,
    data: dataLock,
    write: writeLock,
    error: errorLock,
  } = useLock(
    recipient,
    amount,
    address as any,
    validInput && canLock,
    onLockSuccess,
    onLockError
  )

  // console.log('Allow Contract Write Details')
  // console.log(writeAllow)
  // console.log(dataAllow)
  // console.log(errorAllow)

  // console.log('Lock Contract Write Details')
  // console.log(writeLock)
  // console.log(dataLock)
  // console.log(errorLock)

  let state: SendFlowState
  let write: any

  if (!validInput) {
    state = SendFlowState.needsInput
    write = undefined
  } else if (!allowedToSpend) {
    if (isLoadingAllow) {
      state = SendFlowState.loadingAllowance
      write = undefined
    } else {
      state = SendFlowState.needAllowance
      write = writeAllow
    }
  } else if (canLock) {
    if (isLoadingLock) {
      state = SendFlowState.loadingLock
      write = undefined
    } else {
      state = SendFlowState.allowanceGood
      write = writeLock
    }
  } else {
    state = SendFlowState.LockComplete
    write = undefined
  }

  return {
    isLoading: isLoadingAllow || isLoadingLock,
    write,
    error: errorAllow ?? errorLock,
    state,
  }
}
