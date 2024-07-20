// /app/context/SpeechRecognitionContext.tsx
'use client'

import React, { createContext, useContext, ReactNode, useEffect, useCallback, useMemo, useState, useRef } from 'react'
import { useSpeechRecognition } from '@/components/ui/useSpeechRecognition'
import { useCurrentPage } from './useCurrentPageContext'
import { DialogEntry, SpeechRecognitionContextType } from '@/types/speechRecognition'

const SpeechRecognitionContext = createContext<SpeechRecognitionContextType | undefined>(undefined)

export const SpeechRecognitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const speechRecognition = useSpeechRecognition()
  const { currentPage } = useCurrentPage()
  const lastRecordedPageRef = useRef(currentPage)
  const [error, setError] = useState<string | null>(null)

  const handleError = useCallback((error: string) => {
    setError(error)
    if (error === 'aborted') {
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
    if (currentPage !== lastRecordedPageRef.current) {
      if (speechRecognition.transcript.trim()) {
        addEntryToHistory(speechRecognition.transcript, lastRecordedPageRef.current)
        speechRecognition.updateOptions({ transcript: '' })
      }
      
      addEntryToHistory(`[Page changed to ${currentPage}]`, currentPage)
      
      lastRecordedPageRef.current = currentPage
    }
  }, [currentPage, speechRecognition, addEntryToHistory])

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
    currentPage,
    history: speechRecognition.history,
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
        if (speechRecognition.transcript.trim()) {
          addEntryToHistory(speechRecognition.transcript, currentPage)
          speechRecognition.updateOptions({ transcript: '' })
        }
      }
    }
  }), [speechRecognition, error, currentPage, addEntryToHistory])

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