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
import { aiStream } from '@/lib/ai'
import { useSpeechRecognitionContext } from '@/context/useSpeechRecognitionContext'
import BubbleChat from './ui/bubble-chat'

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty')
})

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()
  const [messages, setMessages] = useState<MessageType[]>([])
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

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
        transcription: transcript
      })

      form.reset()

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
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className='flex-none w-full p-4 bg-background'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex space-x-2'
          >
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
          </form>
        </Form>
      </footer>
    </section>
  )
}
