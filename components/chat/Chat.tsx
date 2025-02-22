'use client'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { useApiKey } from '@/stores/useApiKeysStore'
import { useSpeechRecognitionStore } from '@/stores/useSpeechRecognitionStore'
import { usePDFTextStore } from '@/stores/usePDFTextStore'
import { useChat } from '@/hooks/useChat'
import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import ChatLoading from './ChatLoading'
import AIFunctions from './AIFunctions'

interface ChatProps {
  notebookId: string
  className?: string
}

export default function Chat({ notebookId, className }: ChatProps) {
  const geminiKey = useApiKey('gemini_key')
  const { text } = usePDFTextStore()
  const { history } = useSpeechRecognitionStore()
const [isThinking, setIsThinking] = useState(false)
const [isStreaming, setIsStreaming] = useState(false)

  const {
    messages,
    isLoading,
    isPending,
    handleSendMessage,
    handleStreamUpdate,
    handleStreamComplete,
    handleImportantEvents,
    handleGenerateMindMap
  } = useChat({ 
    notebookId,
    apiKey: geminiKey ?? ''
  })

  if (isLoading) return <ChatLoading className={className} />

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
            messages={messages}
            className={className}
            isPending={isPending}
            thinking={isThinking}
            isWriting={isStreaming}
          />
          <div className='flex flex-col space-y-2 p-2 absolute bottom-0 left-0 w-full'>
            <AIFunctions
              importantEvents={() => handleImportantEvents({ history: history.map(entry => entry.text), text })}
              generateMindMap={() => handleGenerateMindMap({ history: history.map(entry => entry.text), text })}
              isPending={isPending}
            />
            <ChatInput
              messages={messages}
              onSendMessage={handleSendMessage}
              onStreamUpdate={handleStreamUpdate}
              onStreamComplete={handleStreamComplete}
              apiKeyGemini={geminiKey}
              onThinking={setIsThinking}
              onStreaming={setIsStreaming}
              isPending={isPending}
            />
          </div>
        </>
      )}
    </section>
  )
}
