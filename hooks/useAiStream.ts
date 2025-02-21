'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { readStreamableValue } from 'ai/rsc'
import { aiStream } from '@/lib/ai'
import { toast } from '@/components/ui/use-toast'
import type { ChatMessageType, MessageType } from '@/types/chat'
import type { AiMessage, AiStreamParams, AiStreamResponse } from '@/types/ai'

interface UseAiStreamParams {
  onStreamUpdate?: (content: string) => void
  onStreamComplete?: (content: string) => void
  apiKey: string
}

const convertToAiMessages = (messages: ChatMessageType[]): AiMessage[] => {
  return messages
    .filter((msg): msg is MessageType => 'content' in msg)
    .map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.content
    }))
}

export function useAiStream({
  onStreamUpdate,
  onStreamComplete,
  apiKey
}: UseAiStreamParams) {
  // Estado local para manejar el streaming
  const [isStreaming, setIsStreaming] = useState(false)

  // Mutación para el stream de AI
  const mutation = useMutation<
    AiStreamResponse, 
    Error,
    Omit<AiStreamParams, 'apiKey' | 'messageHistory'> & { messages: ChatMessageType[] }
  >({
    mutationFn: async ({ messages, ...params }) => {
      try {
        setIsStreaming(true)
        
        const { textStream, newCacheId } = await aiStream({
          ...params,
          messageHistory: convertToAiMessages(messages),
          apiKey
        })

        // Si newCacheId es distinto a el cacheId actual, debe de hacer el estado isThinking = true
        // En esta parte iria la logica para cambiar el estado de isThinking

        let accumulatedText = ''
        for await (const delta of readStreamableValue(textStream)) {
          accumulatedText += delta
          onStreamUpdate?.(accumulatedText)
        }

        onStreamComplete?.(accumulatedText)
        
        return { content: accumulatedText, newCacheId }
      } catch (error) {
        console.error('Error en el stream de AI:', error)
        toast({
          title: 'Error',
          description: 'Hubo un problema al procesar el mensaje. Por favor, inténtalo de nuevo.',
          variant: 'destructive'
        })
        throw error
      } finally {
        setIsStreaming(false)
      }
    }
  })

  return {
    stream: mutation.mutate,
    streamAsync: mutation.mutateAsync,
    isStreaming,
    ...mutation
  }
}