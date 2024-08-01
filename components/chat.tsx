import React, {
  useRef,
  useEffect,
  useTransition,
  useState,
  useCallback,
  useMemo
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
import { Loader, Send, Sparkles } from 'lucide-react'
import { generateImportantEvents } from '@/lib/ai/ai-extra'
import { usePDFContext } from '@/context/useCurrentPageContext'
import { getChat, createChatNotebook, updateChatNotebook } from '@/actions'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { useApiKey } from '@/context/useAPIKeysContext'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  message: z.string()
})

export default function Chat({ notebookId, className }: { notebookId: string,className?: string }) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [chatId, setChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [apiKeyGemini, setApiKeyGemini] = useState<string | null>(null)

  const geminiKey = useApiKey('gemini_key')

  const { text, extractTextFromPDF } = usePDFText()
  const { fileUrl } = usePDFContext()
  const { history } = useSpeechRecognitionContext()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' }
  })

  useEffect(() => {
    if (geminiKey) {
      setApiKeyGemini(geminiKey)
    }
  }, [geminiKey])

  useEffect(() => {
    if (fileUrl) {
      extractTextFromPDF(fileUrl)
    }
  }, [fileUrl, extractTextFromPDF])

  const loadChat = useCallback(async () => {
    if (!notebookId) return

    setIsLoading(true)
    try {
      const { chat, errorChat } = await getChat(notebookId)

      if (chat) {
        setChatId(chat.chat_id)
        if (chat.content) {
          const parsedContent = JSON.parse(String(chat.content))
          setMessages(Array.isArray(parsedContent) ? parsedContent : [])
        } else {
          setMessages([])
        }
      } else if (errorChat) {
        console.error('Error al cargar el chat:', errorChat)
        toast({
          title: 'Error',
          description:
            'No se pudo cargar el chat. Por favor, recarga la página.',
          variant: 'destructive'
        })
      } else {
        const { chatInsert, errorChatInsert } = await createChatNotebook({
          notebookId
        })
        if (chatInsert) {
          setChatId(chatInsert.chat_id)
          setMessages([])
        } else if (errorChatInsert) {
          console.error('Error al crear el chat:', errorChatInsert)
          toast({
            title: 'Error',
            description:
              'No se pudo crear el chat. Por favor, inténtalo de nuevo más tarde.',
            variant: 'destructive'
          })
        }
      }
    } catch (error) {
      console.error('Error inesperado:', error)
      toast({
        title: 'Error',
        description:
          'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [notebookId])

  useEffect(() => {
    loadChat()
  }, [loadChat])

  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [shouldAutoScroll])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      setShouldAutoScroll(scrollTop + clientHeight >= scrollHeight - 10)
    }
  }, [])

  const updateChatInDatabase = useCallback(
    async (updatedMessages: ChatMessageType[]) => {
      try {
        const { errorChatUpdate } = await updateChatNotebook({
          content: JSON.stringify(updatedMessages),
          notebookId
        })
        if (errorChatUpdate) {
          console.error('Error al actualizar el chat:', errorChatUpdate)
          toast({
            title: 'Advertencia',
            description:
              'No se pudo guardar el último mensaje. Algunos mensajes podrían perderse al recargar la página.',
            variant: 'destructive'
          })
        }
      } catch (error) {
        console.error('Error al actualizar el chat:', error)
        toast({
          title: 'Error',
          description:
            'Hubo un problema al guardar los mensajes. Por favor, guarda una copia de tu conversación importante.',
          variant: 'destructive'
        })
      }
    },
    [notebookId]
  )

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const userMessage: MessageType = {
        content: values.message,
        isUser: true,
        timestamp: new Date().toISOString()
      }
      setMessages((prev) => [...prev, userMessage])
      setShouldAutoScroll(true)
      form.reset()

      await updateChatInDatabase([...messages, userMessage])

      const transcript = history.map((entry) => entry.text).join(' ')
      const messageHistory = messages
        .filter((msg): msg is MessageType => 'content' in msg)
        .map((msg) => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        }))

      startTransition(async () => {
        try {
          const { textStream } = await aiStream({
            prompt: values.message ?? 'Realiza un resumen de todo el contenido',
            transcription: transcript,
            textPdf: text,
            messageHistory: messageHistory,
            apiKey: apiKeyGemini ?? ''
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
              updateChatInDatabase(updatedMessages)
              return updatedMessages
            })
            setShouldAutoScroll(true)
          }
        } catch (err) {
          console.error('Error en el flujo de AI:', err)
          toast({
            title: 'Error',
            description:
              'Hubo un problema al procesar tu mensaje. Por favor, inténtalo de nuevo.',
            variant: 'destructive'
          })
        }
      })
    },
    [messages, history, text, updateChatInDatabase, form, apiKeyGemini]
  )

  const importantEvents = useCallback(() => {
    startTransition(async () => {
      const transcript = history.map((entry) => entry.text).join(' ')
      try {
        const { object } = await generateImportantEvents({
          prompt: 'Lista de eventos importantes para la próxima semana',
          transcription: transcript,
          textPdf: text,
          apiKey: apiKeyGemini ?? ''
        })

        for await (const partialObject of readStreamableValue(object)) {
          if (partialObject) {
            const eventMessage: EventMessageType = {
              events: partialObject.importantEvents,
              isUser: false,
              timestamp: new Date().toISOString()
            }
            setMessages((prev) => {
              const updatedMessages = [...prev, eventMessage]
              updateChatInDatabase(updatedMessages)
              return updatedMessages
            })
          }
        }
        setShouldAutoScroll(true)
      } catch (error) {
        console.error('Error al generar eventos importantes:', error)
        toast({
          title: 'Error',
          description:
            'No se pudieron generar los eventos importantes. Por favor, inténtalo de nuevo.',
          variant: 'destructive'
        })
      }
    })
  }, [history, text, updateChatInDatabase])

  const renderChatContent = useMemo(
    () => (
      <div className='space-y-4'>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <BubbleChat key={index} message={message} />
          ))
        ) : (
          <p className='text-center text-muted-foreground'>
            No hay mensajes aún. Comienza la conversación.
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>
    ),
    [messages]
  )

  if (isLoading) {
    return (
      <section className={cn('flex flex-col max-w-full w-full overflow-hidden h-full max-h-full',
        className
      )}>
        <header className='flex-none w-full py-2 px-4 bg-background'>
          <Skeleton className='h-6 w-24' />
        </header>
        <div className='flex-grow overflow-y-auto pb-16 px-4'>
          <div className='space-y-4'>
            {[...Array(3)].map((_, index) => (
              <div key={index} className='flex flex-col gap-2'>
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
              </div>
            ))}
          </div>
        </div>
        <footer className='w-full p-4'>
          <div className='flex space-x-2'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-20' />
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

      {!apiKeyGemini ? (
        <div className={cn(' flex justify-center items-center h-full w-full p-4', className)}>
          <p className=' text-muted-foreground text-center'>
            Considera ingresar el API KEY necesaria en la configuracion
          </p>
        </div>
      ) : (
        <>
          <div
            className='flex-grow overflow-y-auto pb-16 px-4'
            ref={chatContainerRef}
            onScroll={handleScroll}
          >
            {renderChatContent}
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
                      className=' backdrop-blur-sm bg-background/70'
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

                  <div className='flex space-x-2 relative'>
                    <FormField
                      control={form.control}
                      name='message'
                      render={({ field }) => (
                        <FormItem className='flex-grow relative'>
                          <FormControl>
                            <Input
                              className=' backdrop-blur-sm bg-background/70'
                              placeholder='Escribe tu mensaje'
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button
                      type='submit'
                      size={'icon'}
                      variant={'ghost'}
                      className=' absolute top-1/2 -translate-y-1/2 right-1.5 backdrop-blur-sm bg-background/0 p-2 size-8'
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader className='size-4 animate-spin' />
                      ) : (
                        <Send className='size-4' />
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </footer>
        </>
      )}
    </section>
  )
}
