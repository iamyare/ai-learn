// /app/context/SpeechRecognitionContext.tsx
'use client'

import React, { createContext, useContext, ReactNode, useEffect, useCallback, useMemo, useState } from 'react'
import { useSpeechRecognition} from '@/components/ui/useSpeechRecognition'
import { useCurrentPage } from './useCurrentPageContext'
import { DialogEntry, SpeechRecognitionContextType } from '@/types/speechRecognition'



const SpeechRecognitionContext = createContext<SpeechRecognitionContextType | undefined>(undefined)

export const SpeechRecognitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const speechRecognition = useSpeechRecognition()
  const { currentPage } = useCurrentPage()
  const [lastRecordedPage, setLastRecordedPage] = useState(currentPage)
  const [error, setError] = useState<string | null>(null)

  const handleError = useCallback((error: string) => {
    setError(error)
    if (error === 'aborted') {
      // Attempt to restart listening after a short delay
      setTimeout(() => {
        speechRecognition.startListening()
      }, 1000)
    }
  }, [speechRecognition])

  const finishCurrentTranscription = useCallback(() => {
    if (speechRecognition.transcript.trim()) {
      const newEntry: DialogEntry = {
        timestamp: new Date().toISOString(),
        text: speechRecognition.transcript.trim(),
        page: lastRecordedPage || 1
      }
      speechRecognition.updateOptions({
        history: [...speechRecognition.history, newEntry]
      })
      speechRecognition.stopListening()
      speechRecognition.updateOptions({ transcript: '' })
    }
  }, [speechRecognition, lastRecordedPage])

  const startNewTranscription = useCallback(() => {
    setLastRecordedPage(currentPage || 1)
    if (speechRecognition.isListening) {
      speechRecognition.stopListening()
      speechRecognition.startListening()
    }
  }, [currentPage, speechRecognition])

  useEffect(() => {
    console.log('currentPage', currentPage)
    if (currentPage !== lastRecordedPage) {
      finishCurrentTranscription()
      startNewTranscription()
    }
  }, [currentPage, lastRecordedPage, finishCurrentTranscription, startNewTranscription])

  useEffect(() => {
    const handleSpeechRecognitionError = (event: ErrorEvent) => {
      handleError(event.error)
    }
    
    window.addEventListener('error', handleSpeechRecognitionError)
    
    return () => {
      window.removeEventListener('error', handleSpeechRecognitionError)
    }
  }, [handleError])

  const contextValue = useMemo(() => ({
    ...speechRecognition,
    history: speechRecognition.history.map(entry => ({
      ...entry,
      page: entry.page || 1
    })),
    error,
    startListening: () => {
      setError(null)
      speechRecognition.startListening()
    },
    stopListening: () => {
      speechRecognition.stopListening()
      finishCurrentTranscription()
    }
  }), [speechRecognition, error, finishCurrentTranscription])

  return (
    <SpeechRecognitionContext.Provider value={contextValue}>
      {children}
    </SpeechRecognitionContext.Provider>
  )
}

export const useSpeechRecognitionContext = () => {
  const context = useContext(SpeechRecognitionContext)
  if (context === undefined) {
    throw new Error('useSpeechRecognitionContext must be used within a SpeechRecognitionProvider')
  }
  return context
}