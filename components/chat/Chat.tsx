import React, { useEffect, useCallback, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/components/ui/use-toast'
import { useApiKey } from '@/context/useAPIKeysContext'
import { cn } from '@/lib/utils'
import { usePDFText } from '@/context/usePDFTextExtractionContext'
import { usePDFContext } from '@/context/useCurrentPageContext'
import { useSpeechRecognitionContext } from '@/context/useSpeechRecognitionContext'
import { useChatMessages } from './hooks/useChatMessages'
import { useAIFunctions } from './hooks/useAIFunctions'
import { processUserMessage } from './utils/chatUtils'

import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import ChatLoading from './ChatLoading'
import AIFunctions from './AIFunctions'

const formSchema = z.object({
  message: z.string()
})

export default function Chat({
  notebookId,
  className
}: {
  notebookId: string
  className?: string
}) {
  const [apiKeyGemini, setApiKeyGemini] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const geminiKey = useApiKey('gemini_key')
  const { text, extractTextFromPDF } = usePDFText()
  const { fileUrl } = usePDFContext()
  const { history } = useSpeechRecognitionContext()

  const { messages, setMessages, isLoading, updateChatInDatabase } =
    useChatMessages(notebookId)
  const { handleImportantEvents, handleGenerateMindMap } = useAIFunctions(
    apiKeyGemini,
    (newMessage) => {
      setMessages((prev) => {
        const updatedMessages = [...prev, newMessage]
        updateChatInDatabase(updatedMessages)
        return updatedMessages
      })
    }
  )

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

  const handleSubmit = useCallback(
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
          await processUserMessage(
            values.message,
            apiKeyGemini ?? '',
            transcript,
            text,
            messageHistory,
            setMessages
          )
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
      messages,
      history,
      text,
      updateChatInDatabase,
      form,
      apiKeyGemini,
      setMessages
    ]
  )

  if (isLoading) {
    return <ChatLoading className={className} />
  }

  return (
    <section className='flex flex-col h-full max-h-full relative'>
      <ChatHeader />
      {!apiKeyGemini ? (
        <div
          className={cn(
            'flex justify-center items-center h-full w-full p-4',
            className
          )}
        >
          <p className='text-muted-foreground text-center'>
            Considera ingresar el API KEY necesaria en la configuración
          </p>
        </div>
      ) : (
        <>
          <ChatMessages messages={messages} className={className} />

            <div id='input' className='flex flex-col space-y-2 p-4 absolute bottom-0 left-0 w-full'>
            <AIFunctions
              importantEvents={handleImportantEvents}
              generateMindMap={handleGenerateMindMap}
              isPending={isPending}
            />
            <ChatInput
              form={form}
              onSubmit={handleSubmit}
              isPending={isPending}
            />
            </div>
        </>
      )}
    </section>
  )
}
