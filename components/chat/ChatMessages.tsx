import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  memo,
  useMemo
} from 'react'
import { cn, formatRelativeDate } from '@/lib/utils'
import BubbleChat from './BubbleChat'
import MessageLoading from './messages/MessageLoading'
import { usePresence } from 'framer-motion'
import { ChatMessageType } from '@/types/chat'
import { AnimatedShinyText } from '../ui/animated-shiny-text'

interface ChatMessagesProps {
  isPending?: boolean
  messages: ChatMessageType[]
  className?: string
  thinking?: boolean
}

interface AnimatedMessageProps {
  message: ChatMessageType
  isThinking?: boolean
}

interface MessageGroupProps {
  date: string
  messages: ChatMessageType[]
  isThinking?: boolean
}

const AnimatedMessage = memo(({ message, isThinking }: AnimatedMessageProps) => {
  const [isPresent, safeToRemove] = usePresence()

  useEffect(() => {
    if (!isPresent) {
      safeToRemove()
    }
  }, [isPresent, safeToRemove])

  return (


    <div
      className='animated-message'
      style={{
        animation: isPresent ? 'slideIn 0.3s ease-out' : 'slideOut 0.3s ease-in'
      }}
    >
      <BubbleChat isThinking={isThinking} message={message} />
    </div>

  )
})

AnimatedMessage.displayName = 'AnimatedMessage'

const MessageGroup = memo(({ date, messages, isThinking }: MessageGroupProps) => (
  <div key={date}>
    <p className='text-sm font-medium mx-auto bg-muted rounded-lg size-fit px-6 py-1 shadow-sm my-4'>
      {formatRelativeDate(date)}
    </p>
    <div className='flex flex-col gap-4'>
      {messages.map((message, index) => (
        <AnimatedMessage
          key={`${message.timestamp}-${index}`}
          message={message}
          isThinking={isThinking}
        />
      ))}
    </div>
  </div>
))

MessageGroup.displayName = 'MessageGroup'

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  className,
  isPending,
  thinking
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

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

  const groupedMessages = useMemo(
    () => groupMessagesByDate(messages),
    [messages]
  )

  return (
    <div
      id='chat-messages'
      className={cn(
        'flex-grow overflow-y-auto pb-[120px] pt-[40px] px-4',
        className
      )}
      ref={chatContainerRef}
      onScroll={handleScroll}
    >
      {Object.keys(groupedMessages).length > 0 ? (
        Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <MessageGroup isThinking={thinking} key={date} date={date} messages={dateMessages} />
        ))
      ) : (
        <p className='text-center text-muted-foreground'>
          No hay mensajes aún. Comienza la conversación.
        </p>
      )}

      {isPending && messages.length > 0 && (() => {
        const lastMessage = messages[messages.length - 1];
        const isSpecialType = 'events' in lastMessage ||
                            'mindMap' in lastMessage ||
                            'translation' in lastMessage ||
                            'chartData' in lastMessage;
        return isSpecialType ? <MessageLoading text="Generando..." /> : null;
      })()}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default memo(ChatMessages)
