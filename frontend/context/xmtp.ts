import { createContext } from 'react'
import { Client, Message } from '@xmtp/xmtp-js'
import { Conversation } from '@xmtp/xmtp-js'

export type MessageStoreEvent = {
  peerAddress: string
  messages: Message[]
}

export type XmtpContextType = {
  client: Client | undefined | null
  conversations: Map<string, Conversation> | null
  loadingConversations: boolean
  initClient: () => void
  convoMessages: Map<string, Message[]>
  setConvoMessages: (value: Map<string, Message[]>) => void
}

export const XmtpContext = createContext<XmtpContextType>({
  client: undefined,
  conversations: null,
  loadingConversations: false,
  initClient: () => undefined,
  convoMessages: new Map(),
  setConvoMessages: () => undefined,
})

export default XmtpContext
