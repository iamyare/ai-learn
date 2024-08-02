'use client'
import { DialogEntry, SpeechRecognitionOptions } from "@/types/speechRecognition"
import { useCallback, useEffect, useRef, useState } from "react"

export const useSpeechRecognition = (initialOptions: SpeechRecognitionOptions = {}) => {
  const [options, setOptions] = useState<SpeechRecognitionOptions>(initialOptions)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [history, setHistory] = useState<DialogEntry[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const currentTranscriptRef = useRef('')
  const lastEntryTimestampRef = useRef<number>(0)
  const currentPageRef = useRef<number>(1)

  useEffect(() => {
    currentPageRef.current = currentPage
  }, [currentPage])

  const formatTimestamp = (date: Date): string => {
    return date.toISOString()
  }

  const addToHistory = useCallback((text: string, page: number) => {
    if (text.trim() !== '') {
      setHistory((prevHistory) => {
        const now = Date.now()
        const lastEntry = prevHistory[prevHistory.length - 1]
        
        if (lastEntry && now - lastEntryTimestampRef.current < options.groupingInterval! && lastEntry.page === page) {
          // Group with the last entry if within the interval and on the same page
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
            { timestamp: formatTimestamp(new Date(now)), text: text.trim(), page: page }
          ]
        }
      })
      setTranscript('')
    }
  }, [options.groupingInterval])

  const startListening = useCallback(() => {
    setIsListening(true)
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = options.language || 'es-ES'

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
        addToHistory(currentTranscriptRef.current, currentPageRef.current)
        currentTranscriptRef.current = ''
      } else {
        setTranscript(currentTranscriptRef.current + interimTranscript)
      }
    }

    recognition.onend = () => {
      if (isListening) {
        recognition.start()
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error)
      if (isListening) {
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
  }, [isListening, addToHistory, options.language])

  const stopListening = useCallback(() => {
    setIsListening(false)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    if (currentTranscriptRef.current.trim()) {
      addToHistory(currentTranscriptRef.current, currentPageRef.current)
    }
    setTranscript('')
    currentTranscriptRef.current = ''
  }, [addToHistory])

  const changePage = useCallback((newPage: number) => {
    if (newPage !== currentPageRef.current) {
      if (transcript.trim()) {
        addToHistory(transcript, currentPageRef.current)
        setTranscript('')
      }
      // addToHistory(`[Page changed to ${newPage}]`, newPage)
      setCurrentPage(newPage)
      currentPageRef.current = newPage
    }
  }, [transcript, addToHistory])

  const updateOptions = useCallback((newOptions: Partial<SpeechRecognitionOptions>) => {
    setOptions(prevOptions => ({
      ...prevOptions,
      ...newOptions
    }))
    if (newOptions.language && recognitionRef.current) {
      recognitionRef.current.lang = newOptions.language
    }
    if (newOptions.history) {
      setHistory(newOptions.history)
    }
    if (newOptions.transcript !== undefined) {
      setTranscript(newOptions.transcript)
    }
  }, [])


  const startServerSideRecognition = async () => {
    while (isListening) {
      try {
        const audioChunk = await captureAudioChunk()
        const response = await fetch('/api/speechRecognition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: audioChunk }),
        })
        const data = await response.json()
        if (data.transcription) {
          currentTranscriptRef.current += data.transcription + ' '
          setTranscript(currentTranscriptRef.current)
          addToHistory(currentTranscriptRef.current, currentPageRef.current)
          currentTranscriptRef.current = ''
        }
      } catch (error) {
        console.error('Error en el reconocimiento de voz del servidor:', error)
      }
    }
  }

  return { 
    isListening, 
    transcript, 
    history,
    currentPage,
    startListening, 
    stopListening,
    changePage,
    updateOptions
  }
}


async function captureAudioChunk(): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];

        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const reader = new FileReader();
          reader.readAsArrayBuffer(audioBlob);
          reader.onloadend = () => {
            resolve(reader.result as ArrayBuffer);
          };
        });

        mediaRecorder.start();
        setTimeout(() => {
          mediaRecorder.stop();
        }, 5000); // Capture 5 seconds of audio
      })
      .catch(error => {
        reject(error);
      });
  });
}