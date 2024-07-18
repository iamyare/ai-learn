declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }

  interface DialogEntry {
    timestamp: string
    text: string
  }

  interface SpeechRecognitionContextType {
    isListening: boolean
    transcript: string
    history: DialogEntry[]
    startListening: () => void
    stopListening: () => void
  }

  type MessageType = {
    content: string
    isUser: boolean
    timestamp: string
  }
}
