'use client'

import React, { createContext, useContext, ReactNode, useMemo, useEffect } from 'react'
import { useSpeechRecognition } from '@/components/ui/useSpeechRecognition'
import { useCurrentPage } from './useCurrentPageContext'
import { SpeechRecognitionContextType } from '@/types/speechRecognition'

const SpeechRecognitionContext = createContext<SpeechRecognitionContextType | undefined>(undefined)

export const SpeechRecognitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const speechRecognition = useSpeechRecognition()
  const { currentPage } = useCurrentPage()

  useEffect(() => {
    speechRecognition.changePage(currentPage)
  }, [currentPage, speechRecognition])

  const contextValue = useMemo((): SpeechRecognitionContextType => ({
    ...speechRecognition,
    currentPage,
  }), [speechRecognition, currentPage])

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