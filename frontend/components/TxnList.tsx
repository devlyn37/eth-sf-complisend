import cn from 'classnames'
import XmtpContext from '../context/xmtp'
import React, { useState, useCallback, useContext } from 'react'
import {useAccount} from 'wagmi'
import { LoaderBar } from './LoaderBar'

export const Txn = ({ txn }: any): any => {
  return (
    <div className="flex p-2 rounded-md bg-slate-900 m-2">{JSON.stringify(txn)}</div>
  )
}

export const TxnList = ({ props }: any): any => {
  const [filter, setFilter] = useState('sent')

  let trx_list: any = []
  const { address } = useAccount()

  const { convoMessages, loadingConversations,initClient, client } = useContext(XmtpContext)
  // console.log('MESSAGES',convoMessages)
  if(convoMessages){
    for (let [key, value] of convoMessages) {
      try{
        let reciever = key
        value.forEach((msg)=>{
          try{
            // console.log(txn)
          
            let txn = JSON.parse(msg.content)


            if(filter == 'sent'){
              
              if(msg.senderAddress == address){
                trx_list.push(<Txn key={msg.id} txn={txn} />)
              }
            }else if(filter == 'received'){
              if(msg.recipientAddress == address){
                trx_list.push(<Txn key={msg.id} txn={txn} />)
              }
            }
            
          }catch(e){
            console.error(e)
            console.log('failed to parse txn')
          }
         
        })
        
      }catch(e){
        console.error('invalid message')
      }
    }
  }

  return (
    <div className='flex flex-col items-center w-full'>
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
          received
        </div>
      </div>
      <LoaderBar loading={loadingConversations}></LoaderBar>
      {trx_list}
    </div>
  )
}
