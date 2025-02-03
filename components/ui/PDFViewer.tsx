'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ScrollArea } from './scroll-area'
import { Toolbar } from './toolbar'
import { usePDFStore } from '@/stores/pdfStore'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `/api/pdf-helper?url=unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string
}

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [error, setError] = useState<string | null>(null)
  const pagesRef = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const { scale, setCurrentPage, numPages, setNumPages, setPDFBuffer } = usePDFStore()

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
    const loadPDFBuffer = async () => {
      if (pdfProxyUrl) {
        try {
          const response = await fetch(pdfProxyUrl);
          const buffer = await response.arrayBuffer();
          setPDFBuffer(buffer);
        } catch (err) {
          console.error('Error cargando buffer del PDF:', err);
          setError('Error al cargar el buffer del PDF');
        }
      }
    };

    loadPDFBuffer();
  }, [pdfProxyUrl, setPDFBuffer]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = Number(entry.target.getAttribute('data-page-number'))
            if (pageNum) {
              setCurrentPage(pageNum)
            }
          }
        })
      },
      {
        threshold: 0.5, // El elemento debe estar 50% visible
        rootMargin: '-100px 0px' // Ajuste para mejorar la detección
      }
    )

    // Observar todas las páginas
    const currentPages = pagesRef.current
    currentPages.forEach((page) => {
      if (page) observer.observe(page)
    })

    return () => {
      // Limpiar el observer
      currentPages.forEach((page) => {
        if (page) observer.unobserve(page)
      })
      observer.disconnect()
    }
  }, [numPages, setCurrentPage]) // Recrear observer cuando cambie el número de páginas

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
            setError('Error al cargar el PDF')
          }}
          className="flex flex-col items-center"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div 
              key={`page_${index + 1}`}
              ref={el => { pagesRef.current[index] = el }}
              data-page-number={index + 1}
              className="flex justify-center scroll-mt-4"
            >
              <Page 
                pageNumber={index + 1}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg border border-border/50 my-2 rounded-lg overflow-hidden"
                width={Math.min(800, window.innerWidth - 80) * scale}
                scale={scale}
              />
            </div>
          ))}
        </Document>
      </ScrollArea>
      <Toolbar 
        pagesRef={pagesRef} 
        containerRef={containerRef as React.RefObject<HTMLDivElement>} 
      />
    </div>
  )
}
