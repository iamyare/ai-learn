'use client'

import React, {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useEffect,
  useState
} from 'react'
import { useSpeechRecognition } from '@/components/ui/useSpeechRecognition'
import {
  SpeechRecognitionContextType,
  VisualizationOptions
} from '@/types/speechRecognition'
import { usePDFStore } from '@/stores/usePDFStore'

const SpeechRecognitionContext = createContext<
  SpeechRecognitionContextType | undefined
>(undefined)

export const SpeechRecognitionProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const speechRecognition = useSpeechRecognition()
  const currentPage = usePDFStore((state) => state.currentPage)
  const [visualizationOptions, setVisualizationOptions] =
    useState<VisualizationOptions>({
      showDate: true,
      showTime: true,
      showPage: true
    })

  useEffect(() => {
    speechRecognition.changePage(currentPage)
  }, [currentPage, speechRecognition])

  const contextValue = useMemo(
    (): SpeechRecognitionContextType => ({
      ...speechRecognition,
      currentPage,
      visualizationOptions,
      setVisualizationOptions
    }),
    [speechRecognition, currentPage, visualizationOptions]
  )

  return (
    <SpeechRecognitionContext.Provider value={contextValue}>
      {children}
    </SpeechRecognitionContext.Provider>
  )
}

export const useSpeechRecognitionContext = () => {
  const context = useContext(SpeechRecognitionContext)
  if (context === undefined) {
    throw new Error(
      'useSpeechRecognitionContext must be used within a SpeechRecognitionProvider'
    )
  }
  return context
}
