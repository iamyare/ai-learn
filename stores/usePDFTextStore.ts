import { create } from 'zustand'
import { pdfjs } from 'react-pdf'

interface PDFTextState {
  text: string
  isPending: boolean
  error: string | null
  setText: (text: string) => void
  setError: (error: string | null) => void
  setIsPending: (isPending: boolean) => void
  extractTextFromPDF: (fileUrl: string) => Promise<void>
}

export const usePDFTextStore = create<PDFTextState>((set) => ({
  text: '',
  isPending: false,
  error: null,
  setText: (text) => set({ text }),
  setError: (error) => set({ error }),
  setIsPending: (isPending) => set({ isPending }),
  extractTextFromPDF: async (fileUrl) => {
    try {
      set({ isPending: true, error: null })
      
      const pdf = await pdfjs.getDocument(fileUrl).promise
      let fullText = ''
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
        fullText += pageText + '\n'
      }
      
      set({ text: fullText.trim(), isPending: false })
    } catch (err) {
      set({ error: 'Error extracting text from PDF', isPending: false })
      console.error('PDF extraction error:', err)
    }
  }
}))