import { create } from 'zustand'

interface PDFStore {
  fileUrl: string
  currentPage: number
  setFileUrl: (url: string) => void
  setCurrentPage: (page: number) => void
  onPageChange?: (page: number) => void 
  setOnPageChange: (callback: (page: number) => void) => void
}

export const usePDFStore = create<PDFStore>((set) => ({
  fileUrl: '',
  currentPage: 1,
  onPageChange: undefined,
  setFileUrl: (url) => set({ fileUrl: url }),
  setOnPageChange: (callback) => set({ onPageChange: callback }), 
  setCurrentPage: (page) => set((state) => {
    state.onPageChange?.(page)
    return { currentPage: page }
  })
}))