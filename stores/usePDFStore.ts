import { create } from 'zustand'

interface PDFStore {
  fileUrl: string
  currentPage: number
  setFileUrl: (url: string) => void
  setCurrentPage: (page: number) => void
}

export const usePDFStore = create<PDFStore>((set) => ({
  fileUrl: '',
  currentPage: 1,
  setFileUrl: (url) => set({ fileUrl: url }),
  setCurrentPage: (page) => set({ currentPage: page })
}))