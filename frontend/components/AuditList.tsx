import XmtpContext from '../context/xmtp'
import React, { useContext } from 'react'
import { useAccount } from 'wagmi'
import { LoaderBar } from './LoaderBar'

import { Txn } from './Txn'

const MIN_REPORT_AMOUNT = 300

export const AuditList = ({}: any): any => {
  let trx_list: any = []
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
            if(txn.amount && txn.amount > MIN_REPORT_AMOUNT) {
              trx_list.push(<Txn key={msg.id} txn={txn} />)
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
      {trx_list}
    </div>
  )
}
