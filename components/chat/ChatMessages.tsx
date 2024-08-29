import React, { useRef, useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import BubbleChat from './BubbleChat'

interface ChatMessagesProps {
  messages: ChatMessageType[]
  className?: string
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, className }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [shouldAutoScroll])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      setShouldAutoScroll(scrollTop + clientHeight >= scrollHeight - 10)
    }
  }

  return (
    <div
      className={cn('flex-grow overflow-y-auto pb-16 px-4', className)}
      ref={chatContainerRef}
      onScroll={handleScroll}
    >
      <div className='space-y-4'>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <BubbleChat key={index} message={message} />
          ))
        ) : (
          <p className='text-center text-muted-foreground'>
            No hay mensajes aún. Comienza la conversación.
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default ChatMessages