import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import  {  CoursorText } from '@/components/ui/coursor-text'
import { useSpeechRecognitionContext } from '@/context/useSpeechRecognitionContext'
import { cn } from '@/lib/utils'
import { Mic, Play, SkipBack, SkipForward } from 'lucide-react'

interface SpeechRecognitionProps {
  classNameContainer?: string
  classNameHeader?: string
  classNameTranscript?: string
}

export default function SpeechRecognition({
  classNameContainer,
  classNameHeader,
  classNameTranscript
}: SpeechRecognitionProps) {
  const { isListening, transcript, history, startListening, stopListening } =
    useSpeechRecognitionContext()
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [shouldAutoScroll]);

  useEffect(() => {
    scrollToBottom()
  }, [history, transcript, scrollToBottom])

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
      const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 10
      setShouldAutoScroll(isScrolledToBottom)
    }
  }

  return (
    <section className={cn('flex flex-col h-full w-full', classNameContainer)}>
      <header
        className={cn('flex justify-center py-2 w-full', classNameHeader)}
      >
        <Button size={'icon'} variant={'ghost'}>
          <SkipBack className='size-4' />
        </Button>
        <Button size={'icon'} variant={'ghost'}>
          <Play className='size-4' />
        </Button>
        <Button
          size={'icon'}
          variant={'ghost'}
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? (
            <Mic className='size-4 text-red-500' />
          ) : (
            <Mic className='size-4' />
          )}
        </Button>
        <Button size={'icon'} variant={'ghost'}>
          <SkipForward className='size-4' />
        </Button>
      </header>
      <aside
        className={cn(
          'w-full h-full px-4 overflow-y-auto transcript-scroll-area',
          classNameTranscript
        )}
        ref={scrollAreaRef}
        onScroll={handleScroll}
      >
        {history.length !== 0 ? (
          <>
            {history.map((entry, index) => (
              <p key={index} className='flex flex-col'>
                <span className='ml-2 text-muted-foreground text-sm'>
                  {entry.timestamp} - Page {entry.page || 'Unknown'}
                </span>
                {entry.text}
                {index === history.length - 1 && isListening && (
                  <span>
                    {' '}
                    {transcript}
                    <CoursorText />
                  </span>
                )}
              </p>
            ))}
          </>
        ) : (
          isListening && (
            <span>
              {transcript}
              <CoursorText />
            </span>
          )
        )}
      </aside>
    </section>
  )
}