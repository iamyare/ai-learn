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
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
    const formatTimestamp = (date: Date): string => {
      return date.toISOString().slice(11, 23)
    }
  
    const stopListening = useCallback(() => {
      setIsListening(false)
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
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
  
      let currentTranscript = ''
  
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
          currentTranscript += finalTranscript
          setTranscript(currentTranscript)
          addToHistory(currentTranscript)
          currentTranscript = ''
        } else {
          setTranscript(currentTranscript + interimTranscript)
        }
  
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          if (currentTranscript !== '') {
            addToHistory(currentTranscript)
            currentTranscript = ''
          }
        }, 1000)
      }
  
      recognition.onend = () => {
        if (isListening) {
          recognition.start()
        } else {
          setTranscript('')
        }
      }
  
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error)
        if (isListening) {
          recognition.stop()
          setTimeout(() => recognition.start(), 1000) // Reiniciar después de 1 segundo
        }
      }
  
      recognition.start()
      recognitionRef.current = recognition
  
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        recognition.stop()
        setIsListening(false)
      }
    }, [isListening, addToHistory, stopListening])
  
    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        if (recognitionRef.current) recognitionRef.current.stop()
      }
    }, [])
  
    return { isListening, transcript, history, startListening, stopListening }
  }
  