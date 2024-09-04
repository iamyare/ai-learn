import React, { useRef, useState, useCallback } from 'react'
import { cn, formatRelativeDate } from '@/lib/utils'
import BubbleChat from './BubbleChat'
import MessageLoading from './messages/MessageLoading'


interface ChatMessagesProps {
  isPending?: boolean
  messages: ChatMessageType[]
  className?: string
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, className, isPending}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [shouldAutoScroll])

  // useEffect(() => {
  //   scrollToBottom()
  // }, [messages, scrollToBottom])

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      setShouldAutoScroll(scrollTop + clientHeight >= scrollHeight - 10)
    }
  }

  const groupMessagesByDate = (messages: ChatMessageType[]) => {
      return messages.reduce((groups, message) => {
        const date = new Date(message.timestamp).toDateString()
        if (!groups[date]) {
          groups[date] = []
        }
        groups[date].push(message)
        return groups
      }, {} as Record<string, ChatMessageType[]>)
    }
  
    const groupedMessages = groupMessagesByDate(messages)

  return (
    <div
    id='chat-messages'
      className={cn('flex-grow overflow-y-auto pb-[120px] pt-[40px] px-4', className)}
      ref={chatContainerRef}
    >

        {Object.keys(groupedMessages).length > 0 ? (
          Object.keys(groupedMessages).map((date) => (
            <div key={date}>
              <p className=' text-sm font-medium mx-auto bg-muted rounded-lg size-fit px-6 py-1 shadow-sm my-4'>
                {formatRelativeDate(date)}
              </p>
              <div className='flex flex-col gap-4'>
              {groupedMessages[date].map((message) => (
                <BubbleChat key={message.timestamp} message={message} />
              ))}
              </div>
            </div>
          ))
        ) : (
          <p className='text-center text-muted-foreground'>
            No hay mensajes aún. Comienza la conversación.
          </p>
        )}

        {isPending && <MessageLoading/>}
        <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessages