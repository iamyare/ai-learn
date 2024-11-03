// hooks/useSpeechRecognitionState.ts
import { useState, useTransition, useRef, useEffect } from 'react'
import { getTranscriptions, createTranscriptNotebook, updateTranscriptNotebook } from '@/actions'
import { useSpeechRecognitionContext } from '@/context/useSpeechRecognitionContext'

export const useSpeechRecognitionState = (notebookId: string) => {
  const {
    isListening,
    transcript,
    history,
    startListening,
    stopListening,
    updateOptions,
    visualizationOptions
  } = useSpeechRecognitionContext()

  const [isPending, startTransition] = useTransition()
  const [isPendingTranscription, setIsPendingTranscription] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdated, setIsUpdated] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null)
  const [showPageNumbers, setShowPageNumbers] = useState(true)

  useEffect(() => {
    const loadTranscriptions = async () => {
      setIsLoading(true)
      try {
        const { transcriptions, errorTranscriptions } = await getTranscriptions({ notebookId })
        if (transcriptions?.content) {
          const parsedContent = JSON.parse(String(transcriptions.content))
          updateOptions({ history: parsedContent })
          setIsUpdated(true)
          setLastUpdateTime(new Date(transcriptions.updated_at))
        } else if (errorTranscriptions) {
          console.error('Error al cargar transcripciones:', errorTranscriptions)
          setIsUpdated(false)
        }
      } catch (error) {
        console.error('Error al cargar transcripciones:', error)
        setIsUpdated(false)
      } finally {
        setIsLoading(false)
      }
    }
    loadTranscriptions()
  }, [notebookId, updateOptions])

  const handleAction = async () => {
    startTransition(async () => {
      if (isListening) {
        stopListening()
      } else {
        startListening()
      }

      try {
        const { transcriptions } = await getTranscriptions({ notebookId })
        if (transcriptions) {
            console.log('Se actualizó el estado de las transcripciones:')
          await updateTranscriptNotebook({
            transcriptHistory: history,
            notebookId
          })
        } else {
          await createTranscriptNotebook({
            transcriptHistory: history,
            notebookId
          })
        }

        const { transcriptions: updatedTranscriptions } = await getTranscriptions({ notebookId })
        if (updatedTranscriptions?.content) {
          const parsedContent = JSON.parse(String(updatedTranscriptions.content))
          if (JSON.stringify(parsedContent) === JSON.stringify(history)) {
            setIsUpdated(true)
            setLastUpdateTime(new Date(updatedTranscriptions.updated_at))
          } else {
            setIsUpdated(false)
          }
        } else {
          setIsUpdated(false)
        }
      } catch (error) {
        console.error('Error al actualizar transcripciones:', error)
        setIsUpdated(false)
      }
    })
  }

  return {
    isListening,
    transcript,
    history,
    isPending,
    isPendingTranscription,
    isLoading,
    isUpdated,
    lastUpdateTime,
    showPageNumbers,
    visualizationOptions,
    setIsPendingTranscription,
    setShowPageNumbers,
    handleAction
  }
}