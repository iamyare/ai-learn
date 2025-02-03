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
import { usePDFTextStore } from '@/stores/usePDFTextStore'
import { useSpeechRecognitionStore } from '@/stores/useSpeechRecognitionStore'
import { useNotebookStore } from '@/stores/useNotebookStore'
import { usePDFStore } from '@/stores/pdfStore'

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
  const { history } = useSpeechRecognitionStore()
  const { text } = usePDFTextStore()
  const [isPending, startTransition] = useTransition()
  const { updateNotebookInfo } = useNotebookStore()
  const {  pdfBuffer} = usePDFStore();

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
            messageHistory: messageHistory,
            pdfBuffer: pdfBuffer,
            apiKey: apiKeyGemini ?? ''
          })

          const aiMessage: MessageType = {
            content: '',
            isUser: false,
            timestamp: new Date().toISOString()
          }

          // Agregar mensaje inicial vacío
          setMessages((prev) => [...prev, aiMessage])

          let accumulatedText = ''
          for await (const delta of readStreamableValue(textStream)) {
            accumulatedText += delta
            setMessages((prev) => {
              const newMessages = [...prev]
              const lastIndex = newMessages.length - 1
              if (lastIndex >= 0 && !newMessages[lastIndex].isUser) {
                newMessages[lastIndex] = {
                  ...newMessages[lastIndex],
                  content: accumulatedText
                }
              }
              return newMessages
            })
          }

          // Actualizar la base de datos con el mensaje completo
          await updateChatInDatabase([
            ...messages,
            userMessage,
            { ...aiMessage, content: accumulatedText }
          ])
          updateNotebookInfo({ updated_at: new Date().toISOString() })
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
      form.reset()
    },
    [setMessages, history, messages, form, pdfBuffer, apiKeyGemini, updateChatInDatabase, updateNotebookInfo]
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
