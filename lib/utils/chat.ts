import type { ChatMessageType, MessageType } from '@/types/chat'

export const generateUniqueTimestamp = (() => {
  let lastTimestamp = 0
  let counter = 0
  return () => {
    const now = Date.now()
    if (now === lastTimestamp) {
      counter++
    } else {
      lastTimestamp = now
      counter = 0
    }
    return `${new Date(lastTimestamp).toISOString()}.${counter}`
  }
})()

export function isMessageType(message: ChatMessageType): message is MessageType {
  return 'content' in message
}