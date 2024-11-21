import { create } from 'zustand'
import { DialogEntry, VisualizationOptions, SpeechRecognitionOptions } from '@/types/speechRecognition'

interface SpeechRecognitionState {
  isListening: boolean
  transcript: string
  history: DialogEntry[]
  currentPage: number
  visualizationOptions: VisualizationOptions
  startListening: () => void
  stopListening: () => void
  changePage: (page: number) => void
  setIsListening: (isListening: boolean) => void
  setTranscript: (transcript: string) => void
  setHistory: (history: DialogEntry[]) => void
  setCurrentPage: (page: number) => void
  setVisualizationOptions: (options: VisualizationOptions) => void
  updateOptions: (options: Partial<SpeechRecognitionOptions>) => void
}

export const useSpeechRecognitionStore = create<SpeechRecognitionState>((set) => ({
  isListening: false,
  transcript: '',
  history: [],
  currentPage: 1,
  visualizationOptions: {
    showDate: true,
    showTime: true,
    showPage: true
  },
  startListening: () => {},
  stopListening: () => {},
  changePage: () => {},
  setIsListening: (isListening) => set({ isListening }),
  setTranscript: (transcript) => set({ transcript }),
  setHistory: (history) => set({ history }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setVisualizationOptions: (options) => set({ visualizationOptions: options }),
  updateOptions: (options) => {
    set((state) => ({
      ...state,
      history: options.history ?? state.history,
      transcript: options.transcript ?? state.transcript
    }))
  }
}))