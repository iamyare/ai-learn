'use client'

import React, { useRef, useEffect, useTransition, useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
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
import { usePDFContext } from '@/context/useCurrentPageContext'
import { getChat, createChatNotebook, updateChatNotebook } from '@/actions'
import { Skeleton } from '@/components/ui/skeleton'

const formSchema = z.object({
  message: z.string().min(1, 'El mensaje no puede estar vacío')
})


interface ChatMessageType {
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface EventMessageType {
  events: Array<{
    title: string;
    description: string;
    date: string;
    priority: string;
  }>;
  isUser: boolean;
  timestamp: string;
}

type MessageType = ChatMessageType | EventMessageType;

export default function Chat({ notebookId }: { notebookId: string }) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chatId, setChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { text, extractTextFromPDF } = usePDFText()
  const { fileUrl } = usePDFContext()
  const { history } = useSpeechRecognitionContext()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' }
  })

  useEffect(() => {
    if (fileUrl) {
      extractTextFromPDF(fileUrl)
    }
  }, [fileUrl, extractTextFromPDF])

  useEffect(() => {
    const loadChat = async () => {
      if (!notebookId) return

      setIsLoading(true)
      const { chat, errorChat } = await getChat(notebookId)
      
      console.log('Chat cargado:', chat, errorChat)
      if (chat) {
        setChatId(chat.chat_id)
        if (chat.content) {
          try {
            const parsedContent = JSON.parse(String(chat.content))
            setMessages(Array.isArray(parsedContent) ? parsedContent : [])
          } catch (e) {
            console.error('Error al parsear el contenido del chat:', e)
            setMessages([])
          }
        } else {
          // Si el contenido es null, inicializamos con un array vacío
          setMessages([])
        }
      } else if (errorChat) {
        console.error('Error al cargar el chat:', errorChat)
        setError('No se pudo cargar el chat. Por favor, inténtalo de nuevo.')
      } else {
        // Si no hay chat, creamos uno nuevo
        const { chatInsert, errorChatInsert } = await createChatNotebook({ notebookId })
        if (chatInsert) {
          setChatId(chatInsert.chat_id)
          setMessages([])
        } else if (errorChatInsert) {
          console.error('Error al crear el chat:', errorChatInsert)
          setError('No se pudo crear el chat. Por favor, inténtalo de nuevo.')
        }
      }
      
      setIsLoading(false)
    }
    loadChat()
  }, [notebookId])

  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [shouldAutoScroll])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      setShouldAutoScroll(scrollTop + clientHeight >= scrollHeight - 10)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const userMessage: ChatMessageType = {
      content: values.message,
      isUser: true,
      timestamp: new Date().toISOString()
    }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setShouldAutoScroll(true)
    form.reset()

    const transcript = history.map((entry) => entry.text).join(' ')
    const messageHistory = updatedMessages
      .filter((msg): msg is ChatMessageType => 'content' in msg)
      .map((msg) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }))

    startTransition(async () => {
      try {
        const { textStream } = await aiStream({
          prompt: values.message,
          transcription: transcript,
          textPdf: text,
          messageHistory: messageHistory
        })

        let aiResponse = ''
        for await (const text of textStream) {
          aiResponse += text
          setMessages((prev) => {
            const updatedMessages = [...prev]
            const lastMessage = updatedMessages[updatedMessages.length - 1]
            if (!lastMessage.isUser && 'content' in lastMessage) {
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
          setShouldAutoScroll(true)
        }

        // Actualizar el chat en la base de datos
        const { errorChatUpdate } = await updateChatNotebook({ content: JSON.stringify(updatedMessages), notebookId })
        if (errorChatUpdate) {
          console.error('Error al actualizar el chat:', errorChatUpdate)
          setError('No se pudo actualizar el chat. Por favor, inténtalo de nuevo.')
        }
      } catch (err) {
        console.error('Error en el flujo de AI:', err)
        setError('Hubo un error al procesar la respuesta. Por favor, inténtalo de nuevo.')
      }
    })
  }

  const importantEvents = () => {
    startTransition(async () => {
      const transcript = history.map((entry) => entry.text).join(' ')
      const { object } = await generateImportantEvents({
        prompt: 'Lista de eventos importantes para la próxima semana',
        transcription: transcript,
        textPdf: text
      })

      for await (const partialObject of readStreamableValue(object)) {
        if (partialObject) {
          const eventMessage: ChatMessageType = {
            content: JSON.stringify(partialObject.importantEvents), // Agregar la propiedad content
            isUser: false,
            timestamp: new Date().toISOString()
          }
          setMessages((prev) => {
            const updatedMessages = [...prev, eventMessage]
            // Actualizar el chat en la base de datos
            if (chatId) {
              updateChatNotebook({ content: JSON.stringify(updatedMessages), notebookId })
            } else {
              createChatNotebook({ notebookId })
            }
            return updatedMessages
          })
        }
      }
      setShouldAutoScroll(true)
    })
  }

  if (error) {
    return <div className='error-message'>{error}</div>
  }

  if (isLoading) {
    return (
      <section className='flex flex-col h-full max-h-full'>
        <header className='flex-none w-full py-2 px-4 bg-background'>
          <Skeleton className="h-6 w-24" />
        </header>
        <div className='flex-grow overflow-y-auto pb-16 px-4'>
          <div className='space-y-4'>
            {[...Array(3)].map((_, index) => (
              <div key={index} className='flex flex-col gap-2'>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
        <footer className='w-full p-4'>
          <div className='flex space-x-2'>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-20" />
          </div>
        </footer>
      </section>
    )
  }

  return (
    <section className='flex flex-col h-full max-h-full'>
      <header className='flex-none w-full py-2 px-4 bg-background'>
        <h2 className='text-lg font-semibold'>Chat</h2>
      </header>

      <div
        className='flex-grow overflow-y-auto pb-16 px-4'
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        <div className='space-y-4'>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <BubbleChat key={index} message={message} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">No hay mensajes aún. Comienza la conversación.</p>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className='w-full p-4'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='relative h-full w-full flex flex-col gap-2'
          >
            <div className='absolute flex flex-col gap-2 w-full bottom-0 left-0'>
              <div className='flex gap-2'>
                <Button
                  type='button'
                  size={'sm'}
                  variant={'outline'}
                  disabled={isPending}
                  onClick={importantEvents}
                >
                  {isPending ? (
                    <div className='relative'>
                      <div className='absolute size-3 bg-primary/50 blur-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'></div>
                      <div className='absolute size-3 bg-primary blur-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'></div>
                      <Sparkles className='size-4 relative' />
                    </div>
                  ) : (
                    <Sparkles className='size-4' />
                  )}
                  <span className='ml-1'>Eventos importantes</span>
                </Button>
              </div>

              <div className='flex space-x-2'>
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
                  {isPending ? 'Procesando...' : 'Enviar'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </footer>
    </section>
  )
}