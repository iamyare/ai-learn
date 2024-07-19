'use client'

import { cn } from '@/lib/utils'
import { MarkdownRenderer } from './markdown-reader'

export default function BubbleChat({ message }: { message: ChatMessageType }) {
  return (
    <div className={cn('flex flex-col', message.isUser ? 'items-end' : 'items-start')}>
      <div
        className={`p-3 rounded-2xl ${
          message.isUser
            ? 'bg-primary rounded-br-[4px] text-primary-foreground ml-auto'
            : 'bg-muted rounded-bl-[4px]'
        }`}
      >
        <div className='text-sm'>
          {message.isUser ? (
            <p>{(message as MessageType).content}</p>
          ) : 'content' in message ? (
            <MarkdownRenderer content={(message as MessageType).content} />
          ) : (
            <div className='flex flex-col gap-2'>
              <h2 className='text-xl font-semibold'>Eventos importantes</h2>
              <ul className='space-y-2'>
                {(message as EventMessageType).events.map((event, index) => (
                  <li key={index} className='bg-background p-2 rounded-md  transform-gpu transition-[box-shadow,transform] duration-300 hover:scale-105 hover:shadow-md'>
                    <h4 className='font-medium'>{event.title}</h4>
                    <p className='text-xs text-muted-foreground'>{event.description}</p>
                    <div className='flex justify-between mt-1 text-xs text-muted-foreground'>
                      <span>Fecha: {event.date}</span>
                      <span>Prioridad: {event.priority}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <span className='text-xs mx-2 mt-1 text-muted-foreground'>
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </div>
  )
}