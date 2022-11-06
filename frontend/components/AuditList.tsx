import XmtpContext from '../context/xmtp'
import React, { useContext } from 'react'
import { useAccount } from 'wagmi'
import { LoaderBar } from './LoaderBar'

import { Txn } from './Txn'

const MIN_REPORT_AMOUNT = 1

export const AuditList = ({}: any): any => {
  let trx_list: any = []
  let keys_used:any = {}
  const { address } = useAccount()

  const { convoMessages, loadingConversations } = useContext(XmtpContext)
  console.log('MESSAGES',convoMessages)
  if (convoMessages) {
    for (let [key, value] of convoMessages) {
      try {
        let reciever = key
        value.forEach((msg) => {
          try {
            let txn = JSON.parse((msg as any).content)
            if(keys_used[txn.hash]){
              return
            }
            if(txn.amount && txn.amount > MIN_REPORT_AMOUNT) {
              trx_list.push(<Txn from={msg.senderAddress} to={(msg as any).recipientAddress} key={msg.id} txn={txn} />)
              keys_used[txn.hash] = true
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
    <div>
      <LoaderBar loading={loadingConversations}></LoaderBar>
      <div className="py-8"></div>

      <div>min report amount: {MIN_REPORT_AMOUNT}</div>
      
      <div className=" text-black p-4 flex flex-row w-64">
        
        <div className="m-2 bg-green-500 rounded-md my-2 w-full p-2 cursor-pointer">
          encrypted
        </div>
        <div className="m-2 bg-red-500 rounded-md my-2 w-full p-2 cursor-pointer">
          decrypted
        </div>
      </div>

      <div>
        {trx_list}
      </div>
    </div>
  )
}
