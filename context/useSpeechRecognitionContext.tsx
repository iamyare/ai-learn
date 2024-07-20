// /app/context/SpeechRecognitionContext.tsx
'use client'

import React, { createContext, useContext, ReactNode, useEffect, useCallback, useMemo, useState } from 'react'
import { useSpeechRecognition } from '@/components/ui/useSpeechRecognition'
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

  const addEntryToHistory = useCallback((text: string, page: number) => {
    if (text.trim()) {
      const newEntry: DialogEntry = {
        timestamp: new Date().toISOString(),
        text: text.trim(),
        page: page
      }
      speechRecognition.updateOptions({
        history: [...speechRecognition.history, newEntry],
      })
    }
  }, [speechRecognition])

  useEffect(() => {
    if (currentPage !== lastRecordedPage) {
      // If there's ongoing transcription, add it to history with the previous page
      addEntryToHistory(speechRecognition.transcript, lastRecordedPage)
      
      // Clear the current transcript
      speechRecognition.updateOptions({ transcript: '' })
      
      setLastRecordedPage(currentPage)
    }
  }, [currentPage, lastRecordedPage, speechRecognition, addEntryToHistory])

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
      if (!speechRecognition.isListening) {
        speechRecognition.startListening()
      }
    },
    stopListening: () => {
      if (speechRecognition.isListening) {
        speechRecognition.stopListening()
        // Add any remaining transcript to history
        addEntryToHistory(speechRecognition.transcript, lastRecordedPage)
        speechRecognition.updateOptions({ transcript: '' })
      }
    }
  }), [speechRecognition, error, lastRecordedPage, addEntryToHistory])

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