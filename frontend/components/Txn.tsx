import React from 'react'

export const Txn = ({ txn }: any): any => {
  txn.hash
  return (
    <div className="flex p-2 rounded-md bg-slate-900 m-2">
      <div className=''><span>trx #</span><span>{txn.hash}</span></div>
      <div>{txn.note}</div>
      <div>to<div>{txn.recipient}</div></div>
    </div>
  )
}
