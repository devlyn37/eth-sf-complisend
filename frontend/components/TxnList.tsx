import cn from 'classnames'
import XmtpContext from '../context/xmtp'
import React, { useState, useCallback, useContext } from 'react'
import { useAccount } from 'wagmi'
import { LoaderBar } from './LoaderBar'
import { Txn } from './Txn'

export const TxnList = ({ props }: any): any => {
  const [filter, setFilter] = useState('sent')

  let trx_list: any = []
  let keys_used:any = {}
  const { address } = useAccount()

  const { convoMessages, conversations,loadingConversations, initClient, client } =
    useContext(XmtpContext)
  if (convoMessages) {
    // console.log(conversations)
    for (let [key, value] of convoMessages) {
      // console.log
      try {
        let reciever = key
        value.forEach((msg) => {

          try {
            let txn = JSON.parse((msg as any).content)

            if (filter == 'sent') {
              if (msg.senderAddress == address) {
                if(!keys_used[txn.hash]){
                  trx_list.push(<Txn from={msg.senderAddress} to={(msg as any).recipientAddress} key={txn.hash} txn={txn} />)
                  keys_used[txn.hash] = true
                }
              }
            } else if (filter == 'received') {
              if ((msg as any).recipientAddress == address) {
                if(!keys_used[txn.hash]){
                  trx_list.push(<Txn from={msg.senderAddress} to={(msg as any).recipientAddress} key={txn.hash} txn={txn} />)
                  keys_used[txn.hash] = true
                }
              }
            }
          } catch (e) {
            console.error(e)
            console.log('failed to parse txn')
          }
        })
      } catch (e) {
        console.error('invalid message')
      }
    }
  }

  return (
    <div className="flex flex-col items-left w-full">
      <div className="flex w-fit flex-row rounded-md font-black bg-slate-800 overflow-hidden items-start content-start cursor-pointer mt-2 mb-3">
        <div
          onClick={setFilter.bind(null, 'sent')}
          className={
            'h-full p-2 px-5 ' +
            cn({
              'bg-slate-800': filter != 'sent',
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
              'bg-slate-800': filter != 'received',
              'bg-blue-500': filter == 'received',
            })
          }
        >
          received
        </div>
      </div>
      {loadingConversations && <div className='pt-4'><LoaderBar loading={loadingConversations}></LoaderBar></div>}
      <div className='w-full flex flex-col align-center items-center justify-center'>
        <div className='w-full flex flex-col align-center items-center justify-center w-1/2'>
          {trx_list}
        </div>
      </div>
    </div>
  )
}
