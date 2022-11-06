import { ChevronDoubleRightIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { useAccount } from 'wagmi'


function getFirstAndLast5LettersFromString(str:string){
  return str.substring(0,5) + '...' + str.substring(str.length-5,str.length)
}

export const Txn = ({ from,to,txn }: any): any => {

  const { address } = useAccount()

  if(!txn.amount){
    return null
  }
  // console.log(from)
  return (
    <div className="flex rounded-md bg-slate-800 my-2 flex-col w-full p-4">
      {/* {txn.ipfs && <img className='p-2'><span className='text-slate-700 font-bold'>tnx # </span><span>{txn.hash}</span></div>} */}
      
      <div className='text-4xl flex flex-row font-black'><div className='mr-1 text-slate-400'>$</div><span className='text-white'>{txn.amount}</span></div>
      <div className='flex flex-row'>
        {txn.ipfs && <img className='w-32 h-auto mt-3 mr-3 rounded-md outline outline-3 outline-slate-500' src={txn.ipfs} alt=""/>}
        <div className='mt-3 w-full rounded-md bg-slate-700 p-3 relative outline outline-3 outline-slate-900'><span className='text-slate-500 absolute -top-7 left-0 font-bold'>note: </span><b>{txn.note}</b></div>
      </div>
      
      <a target='_blank' href={`https://goerli.etherscan.io/tx/${txn.hash}`}><div className='p-2 hover:outline outline-4 outline-black font-bold p-2 px-4 bg-yellow-500 rounded-md w-fit mt-4'><span className='text-yellow-700'>tnx #</span><span className='text-black'>{getFirstAndLast5LettersFromString(txn.hash)}</span></div></a>
      <div className='flex flex-row'>
        <a target='_blank' href={`https://goerli.etherscan.io/address/${from}`}><div className='p-2 hover:outline outline-4 outline-black font-bold p-2 px-4 bg-red-500 rounded-md w-fit mt-4'><span className='text-red-700'>from @</span><span className='text-black'>{getFirstAndLast5LettersFromString(from)}</span></div></a>
        <ChevronDoubleRightIcon className='text-slate-400 font-bold w-6 mt-3 mx-2'></ChevronDoubleRightIcon>
        <a target='_blank' href={`https://goerli.etherscan.io/address/${to}`}><div className='p-2 hover:outline outline-4 outline-black font-bold p-2 px-4 bg-green-500 rounded-md w-fit mt-4'><span className='text-green-700'>to @</span><span className='text-black'>{getFirstAndLast5LettersFromString(to)}</span></div></a>
      </div>
      
      
      {/* <div className='flex flex-row'>
        <div className=' m-2 rounded-md bg-slate-700 p-3'><span className='text-slate-400'>note: </span><b>{txn.note}</b></div>
        <div className=' m-2 rounded-md bg-blue-500 p-3'><span className='text-blue-200'>$ </span><b>{txn.amount || 0}</b></div>
      </div>


        {!from && <div className=' m-2 rounded-md bg-yellow-500 p-3'><span className='text-green-700'>to </span><b className='text-yellow-900'>{txn.recipient}</b></div>}
        {from && <div className=' m-2 rounded-md bg-green-500 p-3'><span className='text-green-700'>from </span><b className='text-green-900'>{from}</b></div>}
      </div> */}
    </div>
  )
}
