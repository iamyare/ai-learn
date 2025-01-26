import { useState, useEffect } from 'react'
import { pdfjs } from 'react-pdf'
import type { PDFDocumentProxy } from 'pdfjs-dist'

const usePDFViewer = (fileUrl: string) => {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true)
        setError(null)
        

        
        const pdf = await pdfjs.getDocument(fileUrl).promise
        setPdfDocument(pdf)
        setNumPages(pdf.numPages)
        setIsLoading(false)
      } catch (err) {
        setError('Error al cargar el PDF')
        setIsLoading(false)
        console.error('Error loading PDF:', err)
      }
    }

    loadPDF()
  }, [fileUrl])

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages))
  }

  const goToPreviousPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1))
  }

  const goToPage = (page: number) => {
    const targetPage = Math.max(1, Math.min(page, numPages))
    setPageNumber(targetPage)
  }

  return {
    pageNumber,
    numPages,
    pdfDocument,
    isLoading,
    error,
    goToNextPage,
    goToPreviousPage,
    goToPage
  }
}

export default usePDFViewer
