import React, { useMemo, useRef } from 'react'
import { cn } from '@/lib/utils'
import MessageContent from './messages/MessageContent'
import EventList from './messages/EventList'
import MindMap from './messages/MindMap'
import Chart from './messages/Chart'
import Explanation from './messages/Explanation'
import Translation from './messages/Translation'
import Note from './messages/Note'
import { Card } from '../ui/card'
import CopyButton from '../ui/copy-button'
import { motion, AnimatePresence } from 'framer-motion'
import { ChartMessageType, ChatMessageType, EventMessageType, ExplanationMessageType, MessageType, MindMapMessageType, NoteMessageType, TranslationMessageType } from '@/types/chat'
import { AnimatedShinyText } from '../ui/animated-shiny-text'

interface BubbleChatProps {
  message: ChatMessageType
  isThinking?: boolean
  onCopy?: () => void
  tabIndex?: number
}

// Type guards para los diferentes tipos de mensajes
function isMessageType(message: ChatMessageType): message is MessageType {
  return 'content' in message
}

function isEventMessageType(message: ChatMessageType): message is EventMessageType {
  return 'events' in message
}

function isMindMapMessageType(message: ChatMessageType): message is MindMapMessageType {
  return 'mindMap' in message
}

function isChartMessageType(message: ChatMessageType): message is ChartMessageType {
  return 'chartData' in message
}

function isNoteMessageType(message: ChatMessageType): message is NoteMessageType {
  return 'noteText' in message
}

function isExplanationMessageType(message: ChatMessageType): message is ExplanationMessageType {
  return 'explanation' in message
}

function isTranslationMessageType(message: ChatMessageType): message is TranslationMessageType {
  return 'translation' in message
}

const BubbleChat: React.FC<BubbleChatProps> = ({ message, isThinking, onCopy, tabIndex = 0 }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  
  const messageClass = useMemo(
    () => cn(
      'flex flex-col w-full md:max-w-[80%]', 
      message.isUser ? 'items-end ml-auto' : 'items-start'
    ),
    [message.isUser]
  )

  const bubbleClass = useMemo(
    () =>
      cn(
        'p-4 relative rounded-2xl transition-colors',
        'focus-within:ring-2 focus-within:ring-primary/50',
        'group flex flex-col gap-2',
        message.isUser
          ? 'bg-primary selection-primary rounded-br-[4px] text-primary-foreground border'
          : 'bg-muted rounded-bl-[4px] border'
      ),
    [message.isUser]
  )

  const renderMessageContent = () => {
    if (isMessageType(message)) {
      return message.isUser ? (
        <p className="break-words">{message.content}</p>
      ) : (
        <MessageContent content={message.content} />
      )
    }
    
    if (isEventMessageType(message)) {
      return <EventList events={message.events} />
    }
    
    if (isMindMapMessageType(message)) {
      return <MindMap mindMap={message.mindMap} />
    }
    
    if (isChartMessageType(message)) {
      return <Chart chartData={message.chartData} />
    }
    
    if (isNoteMessageType(message)) {
      return <Note noteText={message.noteText} />
    }
    
    if (isExplanationMessageType(message)) {
      return <Explanation explanation={message.explanation} />
    }
    
    if (isTranslationMessageType(message)) {
      return <Translation translation={message.translation} />
    }

    return <p className="text-destructive">Tipo de mensaje no soportado</p>
  }

  const getMessageText = (): string => {
    if (isMessageType(message)) return message.content
    if (isNoteMessageType(message)) return message.noteText
    if (isTranslationMessageType(message)) {
      const { original, translated, sourceLanguage, targetLanguage } = message.translation
      return `${sourceLanguage} → ${targetLanguage}\n${original}\n${translated}`
    }
    if (isExplanationMessageType(message)) {
      const { context, explanation } = message.explanation
      return `${context}\n\n${explanation}`
    }
    if (isEventMessageType(message)) {
      return message.events.map(event => `${event.date}: ${event.description}`).join('\n')
    }
    if (isMindMapMessageType(message)) {
      return JSON.stringify(message.mindMap, null, 2)
    }
    if (isChartMessageType(message)) {
      return JSON.stringify(message.chartData, null, 2)
    }
    return 'Contenido no copiable'
  }

  return (
    <motion.div 
      className="flex flex-col w-full "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence>
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AnimatedShinyText speed={4} className="m-2 text-xs w-fit">
              <span>✨ Pensando...</span>
            </AnimatedShinyText>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className={messageClass}
        role="listitem"
        aria-label={`Mensaje de ${message.isUser ? 'usuario' : 'asistente'}`}

      >
        <Card 
          className={cn(bubbleClass, 'relative')}
          tabIndex={tabIndex}
          ref={contentRef}
        >
          <div className="text-sm" role="region">
            {renderMessageContent()}
            
          </div>

          <div 
              className={cn(
                'absolute -bottom-2',
                message.isUser ? 'left-2 hidden' : 'right-2'
              )}
            >
              <CopyButton
                value={getMessageText()}
                onCopy={onCopy}
                aria-label="Copiar mensaje"
              />
            </div>
        </Card>

        <time 
          className="text-xs mx-2 mt-1 text-muted-foreground"
          dateTime={new Date(message.timestamp).toISOString()}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </time>
      </div>
    </motion.div>
  )
}

export default React.memo(BubbleChat)
