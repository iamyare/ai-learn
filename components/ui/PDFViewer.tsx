'use client'
import { useEffect, useState, useMemo, useRef } from 'react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Button } from './button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Document, Page, pdfjs } from 'react-pdf'
import { ScrollArea } from './scroll-area'

// Configurar el worker antes de usarlo
pdfjs.GlobalWorkerOptions.workerSrc = `/api/pdf-helper?url=unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string
}

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)
  const pagesRef = useRef<(HTMLDivElement | null)[]>([])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages)
  }

  console.log('fileUrl', fileUrl)

  // Extraer y codificar la ruta del PDF correctamente
  const pdfProxyUrl = useMemo(() => {
    try {
      // Extraer solo la parte después de .com/
      const match = fileUrl.match(/\.com\/(.*)/);
      if (!match) throw new Error('URL malformada');
      
      const path = match[1]
        .split('/')
        .map(segment => encodeURIComponent(segment))
        .join('/');
      
      console.log('URL procesada:', `/api/pdf/${path}`);
      return `/api/pdf/${path}`;
    } catch (err) {
      console.error('Error procesando URL:', {
        error: err,
        originalUrl: fileUrl
      });
      setError('Error al procesar la URL del PDF');
      return null;
    }
  }, [fileUrl])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = Number(entry.target.getAttribute('data-page-number'))
            if (pageNum) setPageNumber(pageNum)
          }
        })
      },
      {
        threshold: 0.5,
        root: null,
      }
    )

    pagesRef.current.forEach((page) => {
      if (page) observer.observe(page)
    })

    return () => observer.disconnect()
  }, [numPages])

  const scrollToPage = (pageNum: number) => {
    pagesRef.current[pageNum - 1]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="flex flex-col items-center gap-4 relative h-full w-full">
      <ScrollArea className="w-full h-full">
        <Document
          file={pdfProxyUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => {
            console.error('Error al cargar PDF:', error)
            setError('Error al cargar el PDF')
          }}
          className="flex flex-col items-center"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div 
              key={`page_${index + 1}`}
              ref={el => {
                pagesRef.current[index] = el;
              }}
              data-page-number={index + 1}
            >
              <Page 
                pageNumber={index + 1}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg border border-border/50 my-2 rounded-lg overflow-hidden"
                width={Math.min(800, window.innerWidth - 80)}
              />
            </div>
          ))}
        </Document>
      </ScrollArea>
      <div className="flex items-center gap-4 absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white/90 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
        <Button
          onClick={() => {
            const newPage = Math.max(pageNumber - 1, 1)
            setPageNumber(newPage)
            scrollToPage(newPage)
          }}
          disabled={pageNumber <= 1}
          variant="outline"
          className="hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="min-w-[100px] text-center font-medium">
          {pageNumber} de {numPages}
        </p>
        <Button
          onClick={() => {
            const newPage = Math.min(pageNumber + 1, numPages)
            setPageNumber(newPage)
            scrollToPage(newPage)
          }}
          disabled={pageNumber >= numPages}
          variant="outline"
          className="hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
