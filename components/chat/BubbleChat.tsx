import React, { useMemo } from 'react'
import { cn } from '@/lib/utils'
import MessageContent from './messages/MessageContent'
import EventList from './messages/EventList'
import MindMap from './messages/MindMap'
import Chart from './messages/Chart'
import Explanation from './messages/Explanation'
import Translation from './messages/Translation'
import Note from './messages/Note'
import { Card } from '../ui/card'
import { ChartMessageType, ChatMessageType, EventMessageType, ExplanationMessageType, MessageType, MindMapMessageType, NoteMessageType, TranslationMessageType } from '@/types/chat'

interface BubbleChatProps {
  message: ChatMessageType
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

const BubbleChat: React.FC<BubbleChatProps> = ({ message }) => {
  const messageClass = useMemo(
    () => cn('flex flex-col', message.isUser ? 'items-end' : 'items-start'),
    [message.isUser]
  )

  const bubbleClass = useMemo(
    () =>
      `p-3 relative w-full rounded-2xl ${
        message.isUser
          ? 'bg-primary selection-primary rounded-br-[4px] text-primary-foreground ml-auto'
          : ' rounded-bl-[4px]'
      }`,
    [message.isUser]
  )

  const renderMessageContent = () => {
    // Si es un mensaje regular
    if (isMessageType(message)) {
      return message.isUser ? (
        <p>{message.content}</p>
      ) : (
        <MessageContent content={message.content} />
      )
    }
    
    // Si es un mensaje de eventos
    if (isEventMessageType(message)) {
      return <EventList events={message.events} />
    }
    
    // Si es un mapa mental
    if (isMindMapMessageType(message)) {
      return <MindMap mindMap={message.mindMap} />
    }
    
    // Si es un gráfico
    if (isChartMessageType(message)) {
      return <Chart chartData={message.chartData} />
    }
    
    // Si es una nota
    if (isNoteMessageType(message)) {
      return <Note noteText={message.noteText} />
    }
    
    // Si es una explicación
    if (isExplanationMessageType(message)) {
      return <Explanation explanation={message.explanation} />
    }
    
    // Si es una traducción
    if (isTranslationMessageType(message)) {
      return <Translation translation={message.translation} />
    }

    // Por defecto, mostrar un mensaje de error
    return <p className="text-red-500">Tipo de mensaje no soportado</p>
  }

  return (
    <div className={messageClass}>
      <Card className={bubbleClass}>
        <div className='text-sm'>{renderMessageContent()}</div>
      </Card>

      <span className='text-xs mx-2 mt-1 text-muted-foreground'>
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </div>
  )
}

export default React.memo(BubbleChat)
