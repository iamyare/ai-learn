import { create } from 'zustand'

interface PDFStore {
  scale: number
  currentPage: number
  numPages: number
  setScale: (scale: number) => void
  setCurrentPage: (page: number) => void
  setNumPages: (pages: number) => void
}

export const usePDFStore = create<PDFStore>((set) => ({
  scale: 1.0,
  currentPage: 1,
  numPages: 0,
  setScale: (scale) => set({ scale }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setNumPages: (numPages) => set({ numPages })
}))
