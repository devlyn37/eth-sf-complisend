import React from 'react'

export const Txn = ({ txn }: any): any => {
  return (
    <div className="flex p-2 rounded-md bg-slate-900 m-2">
      {JSON.stringify(txn)}
    </div>
  )
}
