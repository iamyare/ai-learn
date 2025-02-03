import { useEffect } from 'react'
import { useSpeechRecognition } from '../ui/useSpeechRecognition'
import { useSpeechRecognitionStore } from '@/stores/useSpeechRecognitionStore'
import { usePDFStore } from '@/stores/pdfStore'

export const SpeechRecognitionProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const {
    isListening,
    transcript,
    history,
    currentPage,
    startListening: startSpeechRecognition,
    stopListening: stopSpeechRecognition,
    changePage: changeRecognitionPage,
    updateOptions: updateSpeechRecognitionOptions
  } = useSpeechRecognition()

  const { setIsListening, setTranscript, setHistory, setCurrentPage } =
    useSpeechRecognitionStore()

  const { setOnPageChange } = usePDFStore()

  useEffect(() => {
    setIsListening(isListening)
  }, [isListening, setIsListening])

  useEffect(() => {
    setTranscript(transcript)
  }, [transcript, setTranscript])

  useEffect(() => {
    setHistory(history)
  }, [history, setHistory])

  useEffect(() => {
    setCurrentPage(currentPage)
  }, [currentPage, setCurrentPage])

  useEffect(() => {
    useSpeechRecognitionStore.setState({
      startListening: startSpeechRecognition,
      stopListening: stopSpeechRecognition,
      changePage: changeRecognitionPage,
      updateOptions: updateSpeechRecognitionOptions
    })
  }, [
    startSpeechRecognition,
    stopSpeechRecognition,
    changeRecognitionPage,
    updateSpeechRecognitionOptions
  ])

  useEffect(() => {
    setOnPageChange((page: number) => {
      changeRecognitionPage(page)
    })
  }, [changeRecognitionPage, setOnPageChange])

  return <>{children}</>
}
