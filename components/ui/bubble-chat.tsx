'use client'

import { cn } from '@/lib/utils'
import { MarkdownRenderer } from './markdown-reader'

export default function BubbleChat({message}: {message: MessageType}) {
  return (
    <div className={cn('flex flex-col', message.isUser ? 'items-end': 'items-start')}>
      <div
        className={`p-3 rounded-2xl ${
          message.isUser
            ? 'bg-primary  rounded-br-[4px] text-primary-foreground ml-auto'
            : 'bg-muted rounded-bl-[4px]'
        }`}
      >
        <div className='text-sm'>
          {message.isUser ? (
            <p>{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>
      </div>

      <span className='text-xs mx-2 mt-1 text-muted-foreground'>
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </div>
  )
}
