'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import ChatLoading from './ChatLoading'
import { useChatLogic } from './hooks/useChatLogic'
import AIFunctions from './AIFunctions'

export default function Chat({
  notebookId,
  className
}: {
  notebookId: string
  className?: string
}) {
  const {
    messages,
    isLoading,
    apiKeyGemini,
    isPending,
    handleImportantEvents,
    handleGenerateMindMap,
    updateChatInDatabase,
    setMessages
  } = useChatLogic(notebookId)

  if (isLoading) {
    return <ChatLoading className={className} />
  }

  return (
    <section className='flex flex-col h-full max-h-full relative'>
      <ChatHeader chat={messages} />
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
          <ChatMessages
            messages={messages}
            className={className}
            isPending={isPending}
          />

          <div className='flex flex-col space-y-2 p-2 absolute bottom-0 left-0 w-full'>
            <AIFunctions
              importantEvents={handleImportantEvents}
              generateMindMap={handleGenerateMindMap}
              isPending={isPending}
            />
            <ChatInput
              messages={messages}
              setMessages={setMessages}
              updateChatInDatabase={updateChatInDatabase}
              apiKeyGemini={apiKeyGemini}
            />
          </div>
        </>
      )}
    </section>
  )
}
