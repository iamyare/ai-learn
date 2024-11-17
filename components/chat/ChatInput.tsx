'use client'
import React, { useCallback, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Loader, Send } from 'lucide-react'
import { readStreamableValue } from 'ai/rsc'
import { aiStream } from '@/lib/ai'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '../ui/use-toast'
import { useSpeechRecognitionContext } from '@/context/useSpeechRecognitionContext'
import { usePDFText } from '@/context/usePDFTextExtractionContext'

interface ChatInputProps {
  updateChatInDatabase: (updatedMessages: ChatMessageType[]) => Promise<void>
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageType[]>>
  apiKeyGemini?: string
  messages: ChatMessageType[]
}

const formSchema = z.object({
  message: z.string()
})

const ChatInput: React.FC<ChatInputProps> = ({
  updateChatInDatabase,
  setMessages,
  apiKeyGemini,
  messages
}) => {
  const { history } = useSpeechRecognitionContext()
  const { text } = usePDFText()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' }
  })

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const userMessage: MessageType = {
        content: values.message,
        isUser: true,
        timestamp: new Date().toISOString()
      }
      setMessages((prev) => [...prev, userMessage])
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

          let textContent = ''
          for await (const delta of readStreamableValue(textStream)) {
            textContent = `${textContent}${delta}`
            setMessages((prev) => {
              const updatedMessages = [...prev]
              const lastMessage = updatedMessages[updatedMessages.length - 1]
              if (!lastMessage.isUser && 'content' in lastMessage) {
                lastMessage.content = textContent
              } else {
                updatedMessages.push({
                  content: textContent,
                  isUser: false,
                  timestamp: new Date().toISOString()
                })
              }
              return updatedMessages
            })
          }

          // Actualizar la base de datos después de terminar el stream
          await updateChatInDatabase(messages)
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
    [
      setMessages,
      form,
      updateChatInDatabase,
      messages,
      history,
      text,
      apiKeyGemini
    ]
  )

  return (
    <footer className='w-full'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='relative h-full w-full flex flex-col gap-2'
        >
          <div className='flex space-x-2 relative'>
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem className='flex-grow relative'>
                  <FormControl>
                    <Textarea
                      className='backdrop-blur-sm bg-background/70 resize-none textarea'
                      placeholder='Escribe tu mensaje'
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          form.handleSubmit(onSubmit)()
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type='submit'
              size={'icon'}
              variant={'ghost'}
              className='absolute top-1/2 -translate-y-1/2 right-1.5 backdrop-blur-sm bg-background/0 p-2 size-8'
              disabled={isPending}
            >
              {isPending ? (
                <Loader className='size-4 animate-spin' />
              ) : (
                <Send className='size-4' />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </footer>
  )
}

export default ChatInput
