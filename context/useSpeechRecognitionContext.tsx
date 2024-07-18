// /app/context/SpeechRecognitionContext.tsx
'use client'

import  { createContext, useContext, ReactNode } from 'react'
import { useSpeechRecognition } from '@/components/ui/useSpeechRecognition'
import { SpeechRecognitionContextType } from '../types/speechRecognition'

const SpeechRecognitionContext = createContext<SpeechRecognitionContextType | undefined>(undefined)

export const SpeechRecognitionProvider = ({ children }: { children: ReactNode }) => {
  const speechRecognition = useSpeechRecognition()

  return (
    <SpeechRecognitionContext.Provider value={speechRecognition}>
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