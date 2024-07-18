'use client'
import { useCallback, useEffect, useRef, useState } from "react"

interface DialogEntry {
  timestamp: string
  text: string
}

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [history, setHistory] = useState<DialogEntry[]>([])
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const currentTranscriptRef = useRef('')

  const formatTimestamp = (date: Date): string => {
    return date.toISOString()
  }

  const stopListening = useCallback(() => {
    setIsListening(false)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setTranscript('')
    currentTranscriptRef.current = ''
  }, [])

  const addToHistory = useCallback((text: string) => {
    if (text.trim() !== '') {
      setHistory((prevHistory) => {
        const lastEntry = prevHistory[prevHistory.length - 1]
        if (lastEntry && lastEntry.text === text.trim()) {
          return prevHistory // No añadir si es exactamente igual a la última entrada
        }
        return [
          ...prevHistory,
          { timestamp: formatTimestamp(new Date()), text: text.trim() }
        ]
      })
      setTranscript('')
    }
  }, [])

  const startListening = useCallback(() => {
    setIsListening(true)
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'es-ES'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript !== '') {
        currentTranscriptRef.current += finalTranscript
        setTranscript(currentTranscriptRef.current)
        addToHistory(currentTranscriptRef.current)
        currentTranscriptRef.current = ''
      } else {
        setTranscript(currentTranscriptRef.current + interimTranscript)
      }
    }

    recognition.onend = () => {
      if (isListening) {
        // Reiniciar inmediatamente si aún se supone que estamos escuchando
        recognition.start()
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error)
      if (isListening) {
        // Reiniciar inmediatamente en caso de error
        recognition.stop()
        recognition.start()
      }
    }

    recognition.start()
    recognitionRef.current = recognition

    return () => {
      recognition.stop()
      setIsListening(false)
    }
  }, [isListening, addToHistory])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  return { isListening, transcript, history, startListening, stopListening }
}