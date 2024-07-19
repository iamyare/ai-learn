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
import { formatDate } from '@/lib/utils'
import { generateImportantEvents } from '@/lib/ai/ai-extra'

const formSchema = z.object({
  message: z.string().min(1, 'El mensaje no puede estar vacío')
})

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()
  const [events, setEvents] = useState<ImportantEventType[] | null>(null)
  const [aiResponse, setAiResponse] = useTransition()
  const [messages, setMessages] = useState<MessageType[]>([])
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage: MessageType = {
      content: values.message,
      isUser: true,
      timestamp: new Date().toISOString()
    }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setShouldAutoScroll(true)

    //mostrar todo el historial de transcripciones
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
          if (!lastMessage.isUser) {
            lastMessage.content = aiResponse
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
          setEvents(
            partialObject.importantEvents
          );
        }
      }
    })


  }

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

  return (
    <section className='flex flex-col h-full max-h-full'>
      <header className='flex-none w-full py-2 px-4 bg-background'>
        <h1 className='text-lg font-semibold'>Chat</h1>
      </header>

      <div
        className='flex-grow overflow-y-auto px-4'
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        <div className='space-y-4 py-4'>
          {messages.map((message, index) => (
            <BubbleChat key={index} message={message} />
          ))}
          {
            events && (
              <div className=' flex flex-col gap-2'>
                <h2 className=' text-lg font-semibold '>Eventos importantes</h2>
                <ul className=' grid gap-2'>
                  {events.map((event, index) => (
                    <li key={index} className=' flex flex-col bg-muted/10 border p-2 rounded-lg shadow-md'>
                      <div className=' flex justify-between items-center'>
                      <h3 className=' font-medium  text-foreground'>{event.title}</h3>
                      <span className=' rounded-full px-2 py-1 bg-muted'>
                        {event.priority}
                      </span>
                      </div>
                      <p className=' text-muted-foreground text-sm '>{event.description}</p>
                      <hr className='my-2' />
                        {/* Separar la fecha y la hora */}
                    <div className=' flex justify-between'>
                      <span className=' text-sm text-muted-foreground'>Fecha: {
                         event.date
                        }</span>
                      <span className=' text-muted-foreground'>Hora: {
                          //dar formato solo a la hora
                          formatDate(event.date, 'time')
                        }</span>
                    </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className='flex-none w-full p-4 bg-background'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-2'
          >
            <div className=' flex gap-2'>
              <Button type='button' size={'sm'} variant={'outline'} onClick={importantEvents}>
                <Sparkles className='size-4 mr-2' />
                <span>Eventos importantes</span>
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
          </form>
        </Form>
      </footer>
    </section>
  )
}
