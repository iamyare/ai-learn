import { RefObject } from 'react'
import { Page } from 'react-pdf'
import { usePDFStore } from '@/stores/pdfStore'

interface PDFPageRendererProps {
  numPages: number
  pagesRef: RefObject<(HTMLDivElement | null)[]>
}

export const PDFPageRenderer = ({ numPages, pagesRef }: PDFPageRendererProps) => {
  const { scale } = usePDFStore()

  return (
    <>
      {Array.from(new Array(numPages), (el, index) => (
        <div 
          key={`page_${index + 1}`}
          ref={el => { 
            if (pagesRef.current) {
              pagesRef.current[index] = el 
            }
          }}
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
    </>
  )
}