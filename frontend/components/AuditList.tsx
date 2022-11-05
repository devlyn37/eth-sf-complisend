import cn from 'classnames'
import XmtpContext from '../context/xmtp'
import React, { useState, useCallback, useContext } from 'react'
import {useAccount} from 'wagmi'
import { LoaderBar } from './LoaderBar'

import {Txn} from './Txn'

export const AuditList = ({ user_type,setUserType }: any): any => {
//   const [filter, setFilter] = useState('sent')

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


            if(user_type == 'user'){
              
              if(msg.senderAddress == address){
                trx_list.push(<Txn key={msg.id} txn={txn} />)
              }
            }else if(user_type == 'received'){
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
	<div>
      <LoaderBar loading={loadingConversations}></LoaderBar>
      <div className='py-8'></div>
      {trx_list}
    </div>
  )
}
