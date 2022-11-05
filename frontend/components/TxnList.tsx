import { useState } from 'react'
import cn from 'classnames'

export const Txn = ({ props }: any): any => {
  return (
    <div className="flex p-2 rounded-md bg-slate-900 m-2">trx goes here</div>
  )
}

export const TxnList = ({ props }: any): any => {
  const [filter, setFilter] = useState('sent')

  let trx_list: any = []

  return (
    <div>
      <div className="flex flex-row rounded-xl font-black bg-blue-500 m-2 overflow-hidden items-stretch content-stretch cursor-pointer">
        <div
          onClick={setFilter.bind(null, 'sent')}
          className={
            'h-full p-2 px-5 ' +
            cn({
              'bg-slate-700': filter != 'sent',
              'bg-blue-500': filter == 'sent',
            })
          }
        >
          sent
        </div>
        <div
          onClick={setFilter.bind(null, 'received')}
          className={
            'h-full p-2 px-5 ' +
            cn({
              'bg-slate-700': filter != 'received',
              'bg-blue-500': filter == 'received',
            })
          }
        >
          recieved
        </div>
      </div>
      {trx_list}
    </div>
  )
}
