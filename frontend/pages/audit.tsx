import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { AuditList } from '../components/AuditList'
import { Layout } from '../components/layout/Layout'
import XmtpContext from '../context/xmtp'

const AUDITOR_ETH_ADDRESS = '0x9A8766D4A7C9bb69E536A5cAB873CeA647bE1dD8'

const Audit: NextPage = () => {
  const { initClient, client } = useContext(XmtpContext)
  const {} = useAccount()
  let [xmtp_connected, setXMTPConnected] = useState(false)

  useEffect(() => {
    initClient()
  }, [initClient])

  useEffect(() => {
    if (client) {
      setXMTPConnected(true)
    }
  }, [client])

  return (
    <Layout>
      <div className='flex-col flex p-4'>
        {(xmtp_connected && (
          <div className="p-4">
            <AuditList />
          </div>
        )) || (
          <button
            onClick={initClient}
            className="rounded-xl bg-blue-500 px-4 p-2 font-black m-4"
          >
            load transaction history
          </button>
        )}
      </div>
      
    </Layout>
  )
}
export default Audit
