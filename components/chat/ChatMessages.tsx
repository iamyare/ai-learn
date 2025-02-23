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
import { motion, usePresence, AnimatePresence } from 'framer-motion'
import { ChatMessageType } from '@/types/chat'
import { Card } from '@/components/ui/card'
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'

interface ChatMessagesProps {
  isPending?: boolean
  messages: ChatMessageType[]
  className?: string
  isThinking?: boolean
  isWriting?: boolean
}
interface AnimatedMessageProps {
  message: ChatMessageType
  isThinking?: boolean
  isWriting?: boolean
  isLastAssistantMessage?: boolean
}

interface MessageGroupProps {
  date: string
  messages: { message: ChatMessageType; originalIndex: number }[]
  isThinking?: boolean
  lastAssistantMessageId?: string
}

const AnimatedMessage = memo(({ message, isThinking, isLastAssistantMessage }: AnimatedMessageProps) => {
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
      <BubbleChat
        isThinking={isThinking}
        message={message}
        isLastAssistantMessage={isLastAssistantMessage}
      />
    </div>
  )
})

AnimatedMessage.displayName = 'AnimatedMessage'

const MessageGroup = memo(({ date, messages, isThinking: thinking, lastAssistantMessageId }: MessageGroupProps) => (
  <div key={date}>
    <p className='text-sm font-medium mx-auto bg-muted rounded-lg size-fit px-6 py-1 shadow-sm my-4'>
      {formatRelativeDate(date)}
    </p>
    <div className='flex flex-col gap-4'>
      {messages.map(({ message, originalIndex }) => (
        <AnimatedMessage
          key={`${message.timestamp}-${originalIndex}`}
          message={message}
          isThinking={thinking}
          isLastAssistantMessage={!message.isUser && `${message.timestamp}-${originalIndex}` === lastAssistantMessageId}
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
  isThinking: thinking,
  isWriting
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
    return messages.reduce((groups, message, originalIndex) => {
      const date = new Date(message.timestamp).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push({ message, originalIndex })
      return groups
    }, {} as Record<string, { message: ChatMessageType; originalIndex: number }[]>)
  }

  const groupedMessages = useMemo(
    () => groupMessagesByDate(messages),
    [messages]
  )

  // Encontrar el ID del último mensaje del asistente
  const lastAssistantMessageId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (!messages[i].isUser) {
        return `${messages[i].timestamp}-${i}`
      }
    }
    return undefined
  }, [messages])

  console.log('ChatMessages render',{
    thinking,
    isWriting

  })

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
        Object.entries(groupedMessages).map(([date, dateMessages]) => {
          return (
            <MessageGroup
              key={date}
              date={date}
              messages={dateMessages}
              isThinking={thinking}
              lastAssistantMessageId={lastAssistantMessageId}
            />
          );
        })
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

      <AnimatePresence>
        { !thinking && isWriting && (
          <motion.div
            className="flex flex-col w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 12,
              mass: 0.8
            }}
          >
            <div className="flex flex-col w-full md:max-w-[80%] items-start">
              <Card className="p-3 relative rounded-2xl bg-muted rounded-bl-[4px] border-none">
                <div className="text-sm">
                  <AnimatedShinyText speed={4} className="text-xs w-fit select-none">
                    <span>Escribiendo...</span>
                  </AnimatedShinyText>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  )
}

export default memo(ChatMessages)
