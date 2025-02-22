'use client'
import React, { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Loader, Send } from 'lucide-react'
import { useAiStream } from '@/hooks/useAiStream'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSpeechRecognitionStore } from '@/stores/useSpeechRecognitionStore'
import { useNotebookStore } from '@/stores/useNotebookStore'
import { usePDFStore } from '@/stores/pdfStore'
import { usePDFCache } from '@/hooks/usePDFCache'
import type { ChatMessageType } from '@/types/chat'
import { useToast } from '../ui/use-toast'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onStreamUpdate: (content: string) => void
  onStreamComplete: (finalContent: string) => void
  apiKeyGemini?: string
  messages: ChatMessageType[]
  onThinking: (state: boolean) => void
  isPending: boolean
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
  onThinking,
  isPending 
}) => {
  const { history } = useSpeechRecognitionStore()
  const { notebookInfo, updatePDFDocument } = useNotebookStore()
  const { pdfBuffer } = usePDFStore()
  const { cache, setHash, updateCache } = usePDFCache(notebookInfo.notebook_id)
  const toast = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' }
  })

  const { stream, isStreaming } = useAiStream({
    apiKey: apiKeyGemini ?? '',
    onStreamUpdate,
    onStreamComplete
  })

  useCallback(() => {
    if (pdfBuffer) {
      const hash = Buffer.from(pdfBuffer).slice(0, 32).toString('hex')
      setHash(hash)
    }
  }, [pdfBuffer, setHash])

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      if (!values.message.trim()) return

      onSendMessage(values.message)
      const transcript = history.map((entry) => entry.text).join(' ')


      if (!cache?.cache_id){

        onThinking(true)
      }

      if (cache?.cache_expiration) {
        const expiration = new Date(cache.cache_expiration)
        if (expiration < new Date()) {
          console.log('Cache expired')
          updateCache({ cache_id: null, cache_expiration: null })
          updatePDFDocument({
            cache_id: null,
            cache_expiration: null
          })
          onThinking(true)
        }
      }

      stream({
        prompt: values.message,
        transcription: transcript,
        messages,
        pdfBuffer,
        existingCacheId: cache?.cache_id ? cache.cache_id.replace(/^caches\//, '') : undefined
      }, {
        onSuccess: ({ newCacheId }) => {
          if (newCacheId && cache?.cache_id !== `caches/${newCacheId}`) {
            onThinking(true)
            const expiration = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hora
            updateCache({ cache_id: newCacheId, cache_expiration: expiration })
            updatePDFDocument({
              cache_id: `caches/${newCacheId}`,
              cache_expiration: expiration
            })
            onThinking(false)
          }
          onThinking(false)
          // Limpiar el formulario
          form.reset()
        }
      })
    },
    [onSendMessage, history, cache, stream, messages, pdfBuffer, updateCache, updatePDFDocument, onThinking, form]
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
                      disabled={isStreaming || isPending}
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
              disabled={isStreaming || isPending}
            >
              {isStreaming ? (
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
