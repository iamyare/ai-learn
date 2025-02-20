import { useEffect } from 'react'
import { pdfjs } from 'react-pdf'

export const usePDFWorker = () => {
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `/api/pdf-helper?url=unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
  }, [])
}