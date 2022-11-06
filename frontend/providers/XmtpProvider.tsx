import { useCallback, useEffect, useState } from 'react'
import { Client, Conversation, Message } from '@xmtp/xmtp-js'
import { XmtpContext, XmtpContextType } from '../context/xmtp'
import { useAccount, useSigner } from 'wagmi'

// Fix fetching the address everywhere smh

export const XmtpProvider: React.FC<any> = ({ children }) => {
  const [client, setClient] = useState<Client | null>()
  const { address: walletAddress, isConnecting, isDisconnected } = useAccount()
  const { data: signer } = useSigner()

  const [convoMessages, setConvoMessages] = useState<Map<string, Message[]>>(
    new Map()
  )
  const [loadingConversations, setLoadingConversations] =
    useState<boolean>(true)
  const [conversations, setConversations] = useState<Map<string, Conversation>>(
    new Map()
  )

  // console.log(convoMessages)

  const sendMessage = useCallback(
    async (message: string, recipient: any) => {
      // console.log('send message', message, recipient)
      if (!client) {
        if (!signer) {
          throw new Error('Ah no signer')
        }
        let client = await Client.create(signer)
        setClient(client)
        const conversation = await client.conversations.newConversation(
          recipient
        )
        return conversation.send(message)
        // throw new Error('Did not sign xmtp messages')
      } else {
        const conversation = await client.conversations.newConversation(
          recipient
        )
        return conversation.send(message)
      }
    },
    [signer, client]
  )

  const initClient = useCallback(async () => {
    if (signer && !client) {
      try {
        setClient(await Client.create(signer))
      } catch (e) {
        console.error(e)
        setClient(null)
      }
    }
  }, [signer, client])

  const disconnect = () => {
    setClient(undefined)
    setConversations(new Map())
    setConvoMessages(new Map())
  }
  useEffect(() => {
    if (!client) return

    const listConversations = async () => {
      if (signer == null) {
        throw new Error('No Signer')
      }

      // console.log('Listing conversations')
      setLoadingConversations(true)
      const convos = await client.conversations.list()
      // console.log(convos)
      Promise.all(
        convos.map(async (convo) => {
          let test = await convo.messages()
          // console.log(test)
          if (convo.peerAddress !== walletAddress) {
            const messages = await convo.messages()
            convoMessages.set(convo.peerAddress, messages as any)
            setConvoMessages(new Map(convoMessages))
            conversations.set(convo.peerAddress, convo)
            setConversations(new Map(conversations))
          }
        })
      ).then(() => {
        setLoadingConversations(false)
        if (Notification.permission === 'default') {
          Notification.requestPermission()
        }
      })
    }
    const streamConversations = async () => {
      const stream = await client.conversations.stream()

      if (signer == null || walletAddress == null) {
        throw new Error('No Signer')
      }

      for await (const convo of stream) {
        if (convo.peerAddress !== walletAddress) {
          const messages = await convo.messages()
          convoMessages.set(convo.peerAddress, messages as any)
          setConvoMessages(new Map(convoMessages))
          conversations.set(convo.peerAddress, convo)
          setConversations(new Map(conversations))
        }
      }
    }
    listConversations()
    streamConversations()
  }, [client])

  const [providerState, setProviderState] = useState<XmtpContextType>({
    client,
    initClient,
    sendMessage,
    loadingConversations,
    conversations,
    convoMessages,
    setConvoMessages,
  })

  useEffect(() => {
    setProviderState({
      client,
      initClient,
      sendMessage,
      loadingConversations,
      conversations,
      convoMessages,
      setConvoMessages,
    })
  }, [
    client,
    initClient,
    sendMessage,
    loadingConversations,
    conversations,
    convoMessages,
  ])

  // console.log(conversations)

  return (
    <XmtpContext.Provider value={providerState}>
      {children}
    </XmtpContext.Provider>
  )
}

export default XmtpProvider
