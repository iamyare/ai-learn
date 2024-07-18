
export interface DialogEntry {
    timestamp: string
    text: string
  }
  
  export interface SpeechRecognitionContextType {
    isListening: boolean
    transcript: string
    history: DialogEntry[]
    startListening: () => void
    stopListening: () => void
  }