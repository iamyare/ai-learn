import { create } from 'zustand'

interface PDFStore {
  scale: number
  currentPage: number
  numPages: number
  pdfBuffer: ArrayBuffer | null
  setScale: (scale: number) => void
  setCurrentPage: (page: number) => void
  setNumPages: (pages: number) => void
  setPDFBuffer: (buffer: ArrayBuffer) => void
}

export const usePDFStore = create<PDFStore>((set) => ({
  scale: 1.0,
  currentPage: 1,
  numPages: 0,
  pdfBuffer: null,
  setScale: (scale) => set({ scale }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setNumPages: (numPages) => set({ numPages }),
  setPDFBuffer: (buffer) => set({ pdfBuffer: buffer })
}))
