'use client'
import { useRef } from 'react'
import { Document } from 'react-pdf'
import { ScrollArea } from './scroll-area'
import { Toolbar } from './toolbar'
import { usePDFStore } from '@/stores/pdfStore'
import { usePDFWorker } from './pdf/hooks/usePDFWorker'
import { usePDFUrl } from './pdf/hooks/usePDFUrl'
import { useVisiblePage } from './pdf/hooks/useVisiblePage'
import { PDFPageRenderer } from './pdf/PDFPageRenderer'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

interface PDFViewerProps {
  fileUrl: string
}

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
  const pagesRef = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const { setNumPages, numPages } = usePDFStore()
  
  // Inicializar el worker de PDF.js
  usePDFWorker()
  
  // Procesar URL y buffer del PDF
  const { pdfProxyUrl, error } = usePDFUrl(fileUrl)
  
  // Manejar cálculo de página visible
  useVisiblePage({ pagesRef, numPages })

  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div 
      ref={containerRef} 
      className="flex flex-col items-center gap-4 relative h-full w-full"
    >
      <ScrollArea className="w-full h-full">
        <Document
          file={pdfProxyUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={(error) => {
            console.error('Error al cargar PDF:', error)
          }}
          className="flex flex-col items-center"
        >
          <PDFPageRenderer 
            numPages={numPages} 
            pagesRef={pagesRef} 
          />
        </Document>
      </ScrollArea>
      <Toolbar 
        pagesRef={pagesRef} 
        containerRef={containerRef as React.RefObject<HTMLDivElement>} 
      />
    </div>
  )
}
