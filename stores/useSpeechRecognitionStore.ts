import { create } from 'zustand'
import { DialogEntry, VisualizationOptions } from '@/types/speechRecognition'
import { createSpeechRecognition } from '@/components/ui/useSpeechRecognition'

interface SpeechRecognitionState {
  isListening: boolean
  transcript: string
  history: DialogEntry[]
  currentPage: number
  recognition: SpeechRecognition | null
  visualizationOptions: VisualizationOptions
  startListening: () => void
  stopListening: () => void
  updateTranscript: (text: string) => void
  changePage: (page: number) => void
  updateHistory: (entry: DialogEntry) => void
  updateOptions: (options: { history?: DialogEntry[] }) => void
  setVisualizationOptions: (options: VisualizationOptions) => void
}

export const useSpeechRecognitionStore = create<SpeechRecognitionState>((set, get) => ({
  isListening: false,
  transcript: '',
  history: [],
  currentPage: 1,
  recognition: null,
  visualizationOptions: {
    showDate: true,
    showTime: true,
    showPage: true
  },
  startListening: () => {
    const state = get()
    if (state.isListening) return

    const recognition = createSpeechRecognition()
    if (!recognition) return

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

      get().updateTranscript(finalTranscript || interimTranscript)
    }

    recognition.onend = () => {
      if (get().isListening) {
        recognition.start()
      }
    }

    recognition.start()
    set({ isListening: true, recognition })
  },
  stopListening: () => {
    const { recognition, transcript, currentPage } = get()
    if (recognition) {
      recognition.stop()
      // Guardar el último transcript en el historial si existe
      if (transcript.trim()) {
        get().updateHistory({
          timestamp: new Date().toISOString(),
          text: transcript.trim(),
          page: currentPage
        })
      }
      set({ isListening: false, recognition: null, transcript: '' })
    }
  },
  updateTranscript: (text) => set({ transcript: text }),
  changePage: (page) => {
    const { transcript, currentPage } = get()
    if (page !== currentPage && transcript.trim()) {
      // Guardar el transcript actual antes de cambiar de página
      get().updateHistory({
        timestamp: new Date().toISOString(),
        text: transcript.trim(),
        page: currentPage
      })
      set({ transcript: '' })
    }
    set({ currentPage: page })
  },
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