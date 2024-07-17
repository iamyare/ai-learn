'use client'

import React, { useRef, useEffect, useTransition, useState } from 'react'
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

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty')
})

type Message = {
  content: string
  isUser: boolean
  timestamp: string
}

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()
  const [messages, setMessages] = useState<Message[]>([])
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: ''
    }
  })

  const scrollToBottom = () => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage: Message = {
      content: values.message,
      isUser: true,
      timestamp: new Date().toISOString()
    }
    setMessages(prevMessages => [...prevMessages, userMessage])
    setShouldAutoScroll(true)

    startTransition(async() => {
      const {textStream} = await aiStream({
        prompt: 'Quiero que realices un resumen sobre el siguiente texto:',
        transcription: values.message
      })

      let aiResponse = ''
      for await (const text of textStream) {
        aiResponse += text
        setMessages(prevMessages => {
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
  }, [messages])

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
            <div key={index} className={`p-3 rounded-lg ${message.isUser ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'}`}>
              <span className='block text-xs mb-1'>
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
              <p className='text-sm'>
                {message.content}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className='flex-none w-full p-4 bg-background'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex space-x-2'>
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
            <Button type='submit' disabled={isPending}>Enviar</Button>
          </form>
        </Form>
      </footer>
    </section>
  )
}