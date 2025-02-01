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

const extractTextFromPage = async (page: any) => {
  const textContent = await page.getTextContent()
  return textContent.items
    .map((item: any) => item.str)
    .join(' ')
}

export const usePDFTextStore = create<PDFTextState>((set) => ({
  text: '',
  isPending: false,
  error: null,
  setText: (text) => set({ text }),
  setError: (error) => set({ error }),
  setIsPending: (isPending) => set({ isPending }),
  extractTextFromPDF: async (fileUrl) => {
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      set({ 
        error: 'PDF worker not initialized', 
        isPending: false 
      })
      return
    }

    try {
      set({ isPending: true, error: null })
      
      const pdf = await pdfjs.getDocument(fileUrl).promise
      const numberOfPages = pdf.numPages
      
      const pagePromises = Array.from(
        { length: numberOfPages },
        (_, i) => pdf.getPage(i + 1).then(extractTextFromPage)
      )
      
      const pagesText = await Promise.all(pagePromises)
      const fullText = pagesText.join('\n')
      
      set({ 
        text: fullText.trim(), 
        isPending: false 
      })
    } catch (err) {
      console.error('PDF extraction error:', err)
      set({ 
        error: 'Error extracting text from PDF', 
        isPending: false 
      })
    }
  }
}))