'use client'
import React, { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { useApiKey } from '@/stores/useApiKeysStore'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatKeys, fetchChat, updateChat } from '@/lib/queries/chat'
import { createEventMessage, createMindMapMessage } from '@/lib/mutations/chat'
import { useSpeechRecognitionStore } from '@/stores/useSpeechRecognitionStore'
import { usePDFTextStore } from '@/stores/usePDFTextStore'
import { toast } from '@/components/ui/use-toast'
import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import ChatLoading from './ChatLoading'
import AIFunctions from './AIFunctions'

// Función auxiliar para generar timestamps únicos
const generateUniqueTimestamp = (() => {
  let lastTimestamp = 0
  return () => {
    const now = Date.now()
    if (now <= lastTimestamp) {
      lastTimestamp += 1
    } else {
      lastTimestamp = now
    }
    return new Date(lastTimestamp).toISOString()
  }
})()

// Type guard para MessageType
function isMessageType(message: ChatMessageType): message is MessageType {
  return 'content' in message
}

export default function Chat({
  notebookId,
  className
}: {
  notebookId: string
  className?: string
}) {
  const queryClient = useQueryClient()
  const geminiKey = useApiKey('gemini_key')
  const { text } = usePDFTextStore()
  const { history } = useSpeechRecognitionStore()
  const [streamingMessage, setStreamingMessage] = useState<MessageType | null>(null)
  const [isThinking, setIsThinking] = useState(false)

  const { data: messages = [], isLoading } = useQuery({
    queryKey: chatKeys.chat(notebookId),
    queryFn: () => fetchChat(notebookId),
    enabled: !!notebookId
  })

  const messageMutation = useMutation({
    mutationFn: async (newMessage: ChatMessageType) => {
      return updateChat({
        notebookId,
        content: JSON.stringify([...messages, newMessage])
      })
    },
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({ queryKey: chatKeys.chat(notebookId) })
      const previousMessages = queryClient.getQueryData<ChatMessageType[]>(chatKeys.chat(notebookId))
      queryClient.setQueryData<ChatMessageType[]>(
        chatKeys.chat(notebookId),
        old => [...(old ?? []), newMessage]
      )
      return { previousMessages }
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(chatKeys.chat(notebookId), context?.previousMessages)
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Error al actualizar mensajes',
        variant: 'destructive'
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.chat(notebookId) })
    }
  })

  const handleSendMessage = useCallback((content: string) => {
    // Mensaje del usuario con timestamp único
    const userMessage: MessageType = {
      content,
      isUser: true,
      timestamp: generateUniqueTimestamp()
    }
    messageMutation.mutate(userMessage)

    // Mensaje del asistente con timestamp único posterior
    const assistantMessage: MessageType = {
      content: '',
      isUser: false,
      timestamp: generateUniqueTimestamp()
    }
    setStreamingMessage(assistantMessage)
  }, [messageMutation])

  const handleStreamUpdate = useCallback((content: string) => {
    setStreamingMessage(prev => {
      if (!prev) return null
      return {
        ...prev,
        content
      }
    })
  }, [])

  const handleStreamComplete = useCallback((finalContent: string) => {
    if (streamingMessage) {
      const finalMessage: MessageType = {
        ...streamingMessage,
        content: finalContent
      }
      messageMutation.mutate(finalMessage)
      setStreamingMessage(null)
    }
  }, [streamingMessage, messageMutation])

  const handleImportantEvents = useCallback(async () => {
    if (!geminiKey) {
      toast({ title: 'Error', description: 'API key not found' })
      return
    }
    try {
      const message = await createEventMessage({ history, text, apiKey: geminiKey })
      messageMutation.mutate({
        ...message,
        timestamp: generateUniqueTimestamp()
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al generar eventos',
        variant: 'destructive'
      })
    }
  }, [geminiKey, history, text, messageMutation])

  const handleGenerateMindMap = useCallback(async () => {
    if (!geminiKey) {
      toast({ title: 'Error', description: 'API key not found' })
      return
    }
    try {
      const message = await createMindMapMessage({ history, text, apiKey: geminiKey })
      messageMutation.mutate({
        ...message,
        timestamp: generateUniqueTimestamp()
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al generar mapa mental',
        variant: 'destructive'
      })
    }
  }, [geminiKey, history, text, messageMutation])

  if (isLoading) return <ChatLoading className={className} />

  // Solo incluir el mensaje en streaming si tiene contenido y es de tipo MessageType
  const allMessages = streamingMessage?.content
    ? [...messages, streamingMessage]
    : messages

  return (
    <section className='flex flex-col h-full max-h-full relative'>
      <ChatHeader chat={messages} />
      {!geminiKey ? (
        <div className={cn('flex justify-center items-center h-full w-full p-4', className)}>
          <p className='text-muted-foreground text-center'>
            Considera ingresar el API KEY necesaria en la configuración
          </p>
        </div>
      ) : (
        <>
          <ChatMessages
            messages={allMessages}
            className={className}
            isPending={messageMutation.isPending}
            isThinking={isThinking}
          />
          <div className='flex flex-col space-y-2 p-2 absolute bottom-0 left-0 w-full'>
            <AIFunctions
              importantEvents={handleImportantEvents}
              generateMindMap={handleGenerateMindMap}
              isPending={messageMutation.isPending}
            />
            <ChatInput
              messages={messages}
              onSendMessage={handleSendMessage}
              onStreamUpdate={handleStreamUpdate}
              onStreamComplete={handleStreamComplete}
              apiKeyGemini={geminiKey}
              onThinking={setIsThinking}
            />
          </div>
        </>
      )}
    </section>
  )
}
