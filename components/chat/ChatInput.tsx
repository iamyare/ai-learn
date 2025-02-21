'use client'
import React, { useCallback, useEffect, useTransition } from 'react'
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
import { usePDFCache } from '@/hooks/usePDFCache'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onStreamUpdate: (content: string) => void
  onStreamComplete: (finalContent: string) => void
  apiKeyGemini?: string
  messages: ChatMessageType[]
  onThinking: (isThinking: boolean) => void
}

const formSchema = z.object({
  message: z.string()
})
const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStreamUpdate,
  onStreamComplete,
  apiKeyGemini,
  messages,
  onThinking
}) => {
  const { history } = useSpeechRecognitionStore()
  const [isThinking, startTransition] = useTransition()

  useEffect(() => {
    onThinking(isThinking)
  }, [isThinking, onThinking])


  const { updateNotebookInfo, notebookInfo, updatePDFDocument } = useNotebookStore()
  const { pdfBuffer } = usePDFStore()
  const { cache, setHash, updateCache } = usePDFCache(notebookInfo.notebook_id)

  useEffect(() => {
    if (pdfBuffer) {
      const hash = Buffer.from(pdfBuffer).slice(0, 32).toString('hex')
      setHash(hash)
    }
  }, [pdfBuffer, setHash])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' }
  })

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      if (!values.message.trim()) return

      onSendMessage(values.message)
      const transcript = history.map((entry) => entry.text).join(' ')

      const messageHistory = messages
        .filter((msg): msg is MessageType => 'content' in msg)
        .map((msg) => ({
          role: msg.isUser ? ('user' as const) : ('assistant' as const),
          content: msg.content
        }))

      startTransition(async () => {
        try {

                    // Desactivar estado de "pensando" cuando comienza el stream
                    onThinking(false)

          // Iniciar configuración
          const { textStream, newCacheId } = await aiStream({
            prompt: values.message,
            transcription: transcript,
            messageHistory: messageHistory,
            pdfBuffer: pdfBuffer,
            apiKey: apiKeyGemini ?? '',
            existingCacheId: cache?.cache_id ? cache.cache_id.replace(/^caches\//, '') : undefined
          })


          //Si newCacheId es distinto a notebookInfo.cache_id, estara pensando
          if (newCacheId && newCacheId !== notebookInfo.pdf_document.cache_id) {
            onThinking(true)

              await updateCache({ cache_id: newCacheId })
              updatePDFDocument({ 
                cache_id: `caches/${newCacheId}`,
                cache_expiration: //expira en 1 hora
                  new Date(Date.now() + 60 * 60 * 1000).toISOString()
              })
          }

          onThinking(false)
            


          let accumulatedText = ''
          for await (const delta of readStreamableValue(textStream)) {
            accumulatedText += delta
            onStreamUpdate(accumulatedText)
          }


          onStreamComplete(accumulatedText)


        } catch (err) {
          console.error('Error en el flujo de AI:', err)
          // Asegurarse de resetear el estado de "pensando" en caso de error
          onThinking(false)
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
    [onSendMessage, history, messages, form, onThinking, pdfBuffer, apiKeyGemini, cache?.cache_id, notebookInfo.pdf_document.cache_id, onStreamComplete, updateCache, updatePDFDocument, onStreamUpdate]
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
              disabled={isThinking}
            >
              {isThinking ? (
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
