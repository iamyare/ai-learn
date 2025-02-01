import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core'
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation'
import type { ViewerProps } from '@react-pdf-viewer/core'
import { PDFDocumentProxy } from 'pdfjs-dist'

// Dynamically import the Viewer component with correct props
const DynamicViewer = dynamic(
  () =>
    import('@react-pdf-viewer/core').then((mod) => {
      const DynamicViewerComponent: React.FC<ViewerProps> = (props) => (
        <Viewer {...props} />
      )
      DynamicViewerComponent.displayName = 'DynamicViewerComponent'
      return DynamicViewerComponent
    }),
  { ssr: false }
)

const usePDFViewer = (fileUrl: string) => {
  const [workerSrc, setWorkerSrc] = useState<string | undefined>(undefined)
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null)
  const pageNavigationPluginInstance = pageNavigationPlugin()
  const {
    GoToFirstPage,
    GoToLastPage,
    GoToNextPage,
    GoToPreviousPage,
    CurrentPageInput,
    CurrentPageLabel,
    NumberOfPages
  } = pageNavigationPluginInstance

  useEffect(() => {
    const setupWorker = async () => {
      if (typeof window === 'undefined') return

      try {
        const pdfjsLib = await import('pdfjs-dist')

        // Usar la API route de Next.js (o un CDN) para proxy el worker
        const workerUrl = `/api/pdf-helper?url=unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl
        }

        setWorkerSrc(workerUrl)

        const loadingTask = pdfjsLib.getDocument(fileUrl)
        const pdf = await loadingTask.promise
        setPdfDocument(pdf)
      } catch (error) {
        console.error('Error loading PDF:', error)
      }
    }

    setupWorker()
  }, [fileUrl])

  const viewerProps: ViewerProps = {
    fileUrl: fileUrl,
    plugins: [pageNavigationPluginInstance],
    defaultScale: SpecialZoomLevel.PageFit
  }

  return {
    DynamicViewer,
    viewerProps,
    pageNavigationPluginInstance,
    GoToFirstPage,
    GoToLastPage,
    GoToNextPage,
    GoToPreviousPage,
    CurrentPageInput,
    CurrentPageLabel,
    NumberOfPages,
    workerSrc,
    pdfDocument
  }
}

export default usePDFViewer
