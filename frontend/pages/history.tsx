import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { TxnList } from '../components/TxnList'
import XmtpContext from '../context/xmtp'

const History: NextPage = () => {
  const { initClient, client } = useContext(XmtpContext)
  let [xmtp_connected, setXMTPConnected] = useState(false)

  useEffect(() => {
    initClient()
  }, [])

  useEffect(() => {
    if (client) {
      setXMTPConnected(true)
    }
  }, [client])

  return (
    <Layout>
      {(xmtp_connected && (
        <div className="p-4">
          <TxnList />
        </div>
      )) || (
        <button
          onClick={initClient}
          className="rounded-xl bg-blue-500 px-4 p-2 font-black"
        >
          load transaction history
        </button>
      )}
    </Layout>
  )
}

export default History
