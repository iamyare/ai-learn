
import { create } from 'zustand'
import { DialogEntry, VisualizationOptions } from '@/types/speechRecognition'

interface SpeechRecognitionState {
  isListening: boolean
  transcript: string
  history: DialogEntry[]
  currentPage: number
  visualizationOptions: VisualizationOptions
  startListening: () => void
  stopListening: () => void
  updateTranscript: (text: string) => void
  changePage: (page: number) => void
  updateHistory: (entry: DialogEntry) => void
  updateOptions: (options: { history?: DialogEntry[] }) => void
  setVisualizationOptions: (options: VisualizationOptions) => void
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
  startListening: () => set({ isListening: true }),
  stopListening: () => set({ isListening: false }),
  updateTranscript: (text) => set({ transcript: text }),
  changePage: (page) => set({ currentPage: page }),
  updateHistory: (entry) => 
    set((state) => ({ history: [...state.history, entry] })),
  updateOptions: (options) => 
    set((state) => ({ 
      ...state,
      history: options.history ?? state.history
    })),
  setVisualizationOptions: (options) => 
    set({ visualizationOptions: options })
}))