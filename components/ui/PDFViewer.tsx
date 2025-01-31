'use client'
import { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Button } from './button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { configurePdfWorker } from '@/lib/pdf-worker'

// Cargar react-pdf dinámicamente para evitar errores SSR
const PDFDocument = dynamic(() => import('react-pdf').then(mod => mod.Document), {
  ssr: false
})
const PDFPage = dynamic(() => import('react-pdf').then(mod => mod.Page), {
  ssr: false
})

interface PDFViewerProps {
  fileUrl: string
}

configurePdfWorker()

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)

  

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages)
  }

  console.log('fileUrl', fileUrl)


  
  // Extraer y codificar la ruta del PDF correctamente
  // const pdfProxyUrl = useMemo(() => {
  //   try {
  //     // Extraer solo la parte después de .com/
  //     const match = fileUrl.match(/\.com\/(.*)/);
  //     if (!match) throw new Error('URL malformada');
      
  //     const path = match[1]
  //       .split('/')
  //       .map(segment => encodeURIComponent(segment))
  //       .join('/');
      
  //     console.log('URL procesada:', `/api/pdf/${path}`);
  //     return `/api/pdf/${path}`;
  //   } catch (err) {
  //     console.error('Error procesando URL:', {
  //       error: err,
  //       originalUrl: fileUrl
  //     });
  //     setError('Error al procesar la URL del PDF');
  //     return null;
  //   }
  // }, [fileUrl])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <PDFDocument
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => {
          console.error('Error al cargar PDF:', error)
          setError('Error al cargar el PDF')
        }}
        className="max-w-full"
      >
        <PDFPage 
          pageNumber={pageNumber} 
          renderTextLayer={true}
          renderAnnotationLayer={true}
          className="shadow-lg"
        />
      </PDFDocument>
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
