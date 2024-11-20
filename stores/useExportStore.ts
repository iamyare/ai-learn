import { DialogEntry } from '@/types/speechRecognition'
import { create } from 'zustand'

interface ExportStore {
  messages: ChatMessageType[]
  transcriptions: DialogEntry[] 
  pdfText: string
  pdfUrl: string
  setMessages: (messages: ChatMessageType[]) => void
  setTranscriptions: (transcriptions: DialogEntry[]) => void
  setPdfText: (text: string) => void
  setPdfUrl: (url: string) => void
}

export const useExportStore = create<ExportStore>((set) => ({
  messages: [],
  transcriptions: [], 
  pdfText: '',
  pdfUrl: '',
  setMessages: (messages) => set({ messages }),
  setTranscriptions: (transcriptions) => set({ transcriptions }),
  setPdfText: (text) => set({ pdfText: text }),
  setPdfUrl: (url) => set({ pdfUrl: url })
}))