'use client'
import { useEffect, useState } from 'react'
import { Document, Page } from 'react-pdf'
import { configurePdfWorker } from '@/lib/pdf-worker'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Button } from './button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PDFViewerProps {
  fileUrl: string
}

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)

  useEffect(() => {
    configurePdfWorker()
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="max-w-full"
      >
        <Page 
          pageNumber={pageNumber} 
          renderTextLayer={true}
          renderAnnotationLayer={true}
          className="shadow-lg"
        />
      </Document>
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setPageNumber(page => Math.max(page - 1, 1))}
          disabled={pageNumber <= 1}
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p>
          Página {pageNumber} de {numPages}
        </p>
        <Button
          onClick={() => setPageNumber(page => Math.min(page + 1, numPages))}
          disabled={pageNumber >= numPages}
          variant="outline"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
