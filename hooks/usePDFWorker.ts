import { useEffect, useState } from 'react'
import { pdfjs } from 'react-pdf'

export function usePDFWorker() {
  const [isWorkerInitialized, setIsWorkerInitialized] = useState(false)

  useEffect(() => {
    const initializeWorker = async () => {
      if (typeof window === 'undefined') return
      if (pdfjs.GlobalWorkerOptions.workerSrc) return

      try {
        // Usar la API route de Next.js para proxy el worker
        const workerUrl = `/api/pdf-helper?url=unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
        setIsWorkerInitialized(true)
      } catch (error) {
        console.error('Error initializing PDF worker:', error)
      }
    }

    initializeWorker()
  }, [])

  return { isWorkerInitialized }
}
