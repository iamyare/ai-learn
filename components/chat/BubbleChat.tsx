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

interface BubbleChatProps {
  message: ChatMessageType
}

const BubbleChat: React.FC<BubbleChatProps> = ({ message }) => {
  const messageClass = useMemo(
    () => cn('flex flex-col', message.isUser ? 'items-end' : 'items-start'),
    [message.isUser]
  )

  const bubbleClass = useMemo(
    () =>
      `p-3 relative w-full rounded-2xl overflow-hidden ${
        message.isUser
          ? 'bg-primary rounded-br-[4px] text-primary-foreground ml-auto'
          : ' rounded-bl-[4px]'
      }`,
    [message.isUser]
  )

  const renderMessageContent = () => {
    if ('content' in message) {
      return message.isUser ? (
        <p>{message.content}</p>
      ) : (
        <MessageContent content={message.content} />
      )
    } else if ('events' in message) {
      return <EventList events={message.events} />
    } else if ('mindMap' in message) {
      return <MindMap mindMap={message.mindMap} />
    } else if ('chartData' in message) {
      return <Chart chartData={message.chartData} />
    } else if ('noteText' in message) {
      return <Note noteText={message.noteText} />
    } else if ('explanation' in message) {
      return <Explanation explanation={message.explanation} />
    } else if ('translation' in message) {
      return <Translation translation={message.translation} />
    } 
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

export default BubbleChat