'use client'

import { useCallback, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatKeys, fetchChat, updateChat } from '@/lib/queries/chat'
import { createEventMessage, createMindMapMessage } from '@/lib/mutations/chat'
import { toast } from '@/components/ui/use-toast'
import type { ChatMessageType, MessageType } from '@/types/chat'

interface UseChatProps {
  notebookId: string
  apiKey?: string
}

export function useChat({ notebookId, apiKey }: UseChatProps) {
  const queryClient = useQueryClient()
  const [streamingMessage, setStreamingMessage] = useState<MessageType | null>(null)

  // Query para obtener los mensajes
  const { data: messages = [], isLoading } = useQuery({
    queryKey: chatKeys.chat(notebookId),
    queryFn: () => fetchChat(notebookId),
    enabled: !!notebookId
  })

  // Mutación para actualizar mensajes
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

  // Handlers
  const handleSendMessage = useCallback((content: string) => {
    const userMessage: MessageType = {
      content,
      isUser: true,
      timestamp: new Date().toISOString()
    }
    messageMutation.mutate(userMessage)

    const assistantMessage: MessageType = {
      content: '',
      isUser: false,
      timestamp: new Date().toISOString()
    }
    setStreamingMessage(assistantMessage)
  }, [messageMutation])

  const handleStreamUpdate = useCallback((content: string) => {
    setStreamingMessage(prev => {
      if (!prev) return null
      return { ...prev, content }
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

  const handleImportantEvents = useCallback(async (params: { history: string[], text: string }) => {
    if (!apiKey) {
      toast({ title: 'Error', description: 'API key not found' })
      return
    }
    try {
      const message = await createEventMessage({ 
        ...params, 
        apiKey 
      })
      messageMutation.mutate({
        ...message,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al generar eventos',
        variant: 'destructive'
      })
    }
  }, [apiKey, messageMutation])

  const handleGenerateMindMap = useCallback(async (params: { history: string[], text: string }) => {
    if (!apiKey) {
      toast({ title: 'Error', description: 'API key not found' })
      return
    }
    try {
      const message = await createMindMapMessage({ 
        ...params, 
        apiKey 
      })
      messageMutation.mutate({
        ...message,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al generar mapa mental',
        variant: 'destructive'
      })
    }
  }, [apiKey, messageMutation])

  const allMessages = streamingMessage?.content
    ? [...messages, streamingMessage]
    : messages

  return {
    messages: allMessages,
    isLoading,
    isPending: messageMutation.isPending,
    handleSendMessage,
    handleStreamUpdate,
    handleStreamComplete,
    handleImportantEvents,
    handleGenerateMindMap
  }
}