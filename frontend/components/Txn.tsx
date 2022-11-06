import React from 'react'

export const Txn = ({ from,txn }: any): any => {
  console.log(from)
  return (
    <div className="flex p-2 rounded-md bg-slate-800 m-2 flex-col w-full">
      {/* {txn.ipfs && <img className='p-2'><span className='text-slate-700 font-bold'>tnx # </span><span>{txn.hash}</span></div>} */}
      {txn.ipfs && <img className='w-14 h-auto' src={txn.ipfs} alt=""/>}

      <div className='p-2'><span className='text-slate-700 font-bold'>tnx # </span><span>{txn.hash}</span></div>
      <div className='flex flex-row'>
        <div className=' m-2 rounded-md bg-slate-700 p-3'><span className='text-slate-400'>note: </span><b>{txn.note}</b></div>
        <div className=' m-2 rounded-md bg-blue-500 p-3'><span className='text-blue-200'>$ </span><b>{txn.amount || 0}</b></div>
        {!from && <div className=' m-2 rounded-md bg-yellow-500 p-3'><span className='text-green-700'>to </span><b className='text-yellow-900'>{txn.recipient}</b></div>}
        {from && <div className=' m-2 rounded-md bg-green-500 p-3'><span className='text-green-700'>from </span><b className='text-green-900'>{from}</b></div>}
      </div>
    </div>
  )
}
