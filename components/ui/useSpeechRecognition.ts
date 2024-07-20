'use client'
import { DialogEntry, SpeechRecognitionOptions } from "@/types/speechRecognition"
import { useCallback, useEffect, useRef, useState } from "react"





export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}) => {
  const {
    groupingInterval = 5000,
    language = 'es-ES'
  } = options

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [history, setHistory] = useState<DialogEntry[]>([])
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const currentTranscriptRef = useRef('')
  const lastEntryTimestampRef = useRef<number>(0)
  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = { groupingInterval, language }
  }, [groupingInterval, language])

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
        const now = Date.now()
        const lastEntry = prevHistory[prevHistory.length - 1]
        
        if (lastEntry && now - lastEntryTimestampRef.current < optionsRef.current.groupingInterval!) {
          // Group with the last entry if within the interval
          const updatedHistory = [...prevHistory]
          updatedHistory[updatedHistory.length - 1] = {
            ...lastEntry,
            text: lastEntry.text + ' ' + text.trim()
          }
          return updatedHistory
        } else {
          // Create a new entry
          lastEntryTimestampRef.current = now
          return [
            ...prevHistory,
            { timestamp: formatTimestamp(new Date(now)), text: text.trim(), page: undefined }
          ]
        }
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
    recognition.lang = optionsRef.current.language!

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

  const updateOptions = useCallback((newOptions: Partial<SpeechRecognitionOptions>) => {
    optionsRef.current = { ...optionsRef.current, ...newOptions }
    if (recognitionRef.current) {
      recognitionRef.current.lang = optionsRef.current.language!
    }
    if (newOptions.history) {
      setHistory(newOptions.history); // Add this line
    }
  }, [])

  return { 
    isListening, 
    transcript, 
    history,
    
    startListening, 
    stopListening,
    updateOptions
  }
}