import { create } from 'zustand'

interface PDFStore {
  scale: number
  currentPage: number
  numPages: number
  fileUrl: string
  pdfBuffer: ArrayBuffer | null
  setFileUrl: (url: string) => void
  setScale: (scale: number) => void
  setCurrentPage: (page: number) => void
  setNumPages: (pages: number) => void
  onPageChange?: (page: number) => void
  setOnPageChange: (callback: (page: number) => void) => void
  setPDFBuffer: (buffer: ArrayBuffer) => void
}

export const usePDFStore = create<PDFStore>((set) => ({
  scale: 1.0,
  currentPage: 1,
  numPages: 0,
  pdfBuffer: null,
  fileUrl: '',
  onPageChange: undefined,
  setScale: (scale) => set({ scale }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setNumPages: (numPages) => set({ numPages }),
  setPDFBuffer: (buffer) => set({ pdfBuffer: buffer }),
  setFileUrl: (fileUrl) => set({ fileUrl }),
  setOnPageChange: (callback) => set({ onPageChange: callback }),
}))
