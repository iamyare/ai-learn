'use client'

import React, {
  useRef,
  useEffect,
  useTransition,
  useState,
  useCallback
} from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useSpeechRecognitionContext } from '@/context/useSpeechRecognitionContext'
import BubbleChat from './ui/bubble-chat'
import { usePDFText } from '@/context/usePDFTextExtractionContext'
import { aiStream } from '@/lib/ai'
import { readStreamableValue } from 'ai/rsc'
import { Sparkles } from 'lucide-react'
import { generateImportantEvents } from '@/lib/ai/ai-extra'

const formSchema = z.object({
  message: z.string().min(1, 'El mensaje no puede estar vacío')
})

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()
  // const [events, setEvents] = useState<ImportantEventType[] | EventMessageType>(null)
  const [aiResponse, setAiResponse] = useTransition()
  const [messages, setMessages] = useState<(ChatMessageType[])>([])
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  const { text } = usePDFText()

  const { history } = useSpeechRecognitionContext()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: ''
    }
  })

  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [shouldAutoScroll, messagesEndRef])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 10
      setShouldAutoScroll(isScrolledToBottom)
    }
  }


  function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage: MessageType = {
      content: values.message,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setShouldAutoScroll(true)

    const transcript = history.map((entry) => entry.text).join(' ')

    startTransition(async () => {
      const { textStream } = await aiStream({
        prompt: values.message,
        transcription: transcript,
        textPdf: text
      })

      let aiResponse = ''
      for await (const text of textStream) {
        aiResponse += text
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages]
          const lastMessage = updatedMessages[updatedMessages.length - 1]
          if (!lastMessage.isUser && 'content' in lastMessage) {
            lastMessage.content = aiResponse
            setShouldAutoScroll(true)
          } else {
            updatedMessages.push({
              content: aiResponse,
              isUser: false,
              timestamp: new Date().toISOString()
            })
          }
          return updatedMessages
        })
      }

      form.reset()
    })
  }

  function importantEvents() {
    setAiResponse(async() => {
      const transcript = history.map((entry) => entry.text).join(' ')

      const { object } = await generateImportantEvents({
        prompt: "Lista de cosas importantes para la próxima semana",
        transcription: transcript,
        textPdf: text
      });

      for await (const partialObject of readStreamableValue(object)) {
        if (partialObject) {
          const eventMessage: EventMessageType = {
            events: partialObject.importantEvents,
            isUser: false,
            timestamp: new Date().toISOString()
          };
          setMessages((prevMessages) => [...prevMessages, eventMessage]);
          // setEvents(partialObject.importantEvents);
        }
      }
      setShouldAutoScroll(true)
    })
  }


  return (
    <section className='flex flex-col h-full max-h-full'>
      <header className='flex-none w-full py-2 px-4 bg-background'>
        <h2 className='text-lg font-semibold'>Chat</h2>
      </header>

      <div
        className='flex-grow overflow-y-auto pb-16   px-4'
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        <div className='space-y-4'>
          {messages.map((message, index) => (
            <BubbleChat key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className=' w-full p-4 '>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='  relative h-full w-full flex flex-col gap-2'
          >
            <div className=' absolute flex flex-col gap-2  w-full bottom-0 left-0'>
            <div className=' flex gap-2'>
              <Button type='button' size={'sm'} variant={'outline'} disabled={aiResponse} onClick={importantEvents}>
                {
                  aiResponse ? (
                    <div className='relative'>
                      <div className='absolute size-3 bg-primary/50 blur-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'></div>
                      <div className='absolute size-3 bg-primary blur-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'></div>
                      <Sparkles className='size-4 relative' />
                    </div>
                  ) : (

                      <Sparkles className='size-4 ' />
                  )
                }
                <span className='ml-1'>Eventos importantes</span>
              </Button>
            </div>

            <div className=' flex space-x-2'>
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem className='flex-grow'>
                  <FormControl>
                    <Input placeholder='Escribe tu mensaje' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isPending}>
              Enviar
            </Button>
            </div>
            </div>
          </form>
        </Form>
      </footer>
    </section>
  )
}
