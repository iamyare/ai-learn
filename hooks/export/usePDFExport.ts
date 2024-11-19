import { useCallback } from 'react'
import { jsPDF } from 'jspdf'
import { useEventsPDFRenderer } from './useEventsPDFRenderer'
import { usePageFooter } from './usePageFooter'
import { format } from '@formkit/tempo'
import { useTranscriptionsPDFRenderer } from './useTranscriptionsPDFRenderer'
import { useDocumentConverter } from './useDocumentConverter'
import { useConversationPDFRenderer } from './useConversationPDFRenderer'

interface PDFExportConfig {
  pageSize: 'a4' | 'letter' | 'legal' | 'tabloid'
  orientation: 'portrait' | 'landscape'
  notebookName: string // Añadimos el nombre del notebook
}

export const usePDFExport = () => {
  const { renderEvents } = useEventsPDFRenderer()
  const { renderPageFooter } = usePageFooter()
  const { renderTranscriptions } = useTranscriptionsPDFRenderer()
  const { convertToStructuredData } = useDocumentConverter()
  const { renderConversation } = useConversationPDFRenderer()

  const exportToPDF = useCallback(async (config: PDFExportConfig) => {
    const data = convertToStructuredData(config.notebookName)
    console.log('data', data)
    const doc = new jsPDF({
      orientation: config.orientation,
      unit: 'mm',
      format: config.pageSize
    })

    const margin = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const textWidth = pageWidth - (2 * margin)
    const footerSpace = 15 // Espacio reservado para el pie de página
    let currentY = margin

    // Título del notebook
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(44, 62, 80)
    doc.text(config.notebookName, margin, currentY)
    currentY += 15

    // Renderizar secciones en orden
    data.sections.forEach(section => {
      // Asegurar nueva página si estamos cerca del final
      if (currentY > pageHeight - margin - footerSpace - 100) {
        doc.addPage()
        currentY = margin
      }

      switch (section.type) {
        case 'transcriptions':
          currentY = renderTranscriptions(doc, section.content, currentY, margin, pageWidth, pageHeight)
          currentY += 15
          break
        case 'events':
          currentY = renderEvents(doc, section.content, currentY, margin, pageWidth, pageHeight)
          currentY += 15
          break
        case 'conversation':
            console.log('rendering conversation', section.content)
          currentY = renderConversation(doc, section.content, currentY, margin, pageWidth, pageHeight)
          currentY += 15
          break
      }
    })

    // Asegurar que todas las páginas tengan el pie de página correcto
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.saveGraphicsState()
      renderPageFooter(doc, pageWidth, pageHeight, margin, config.notebookName)
      doc.restoreGraphicsState()
    }

    const fileName = `${config.notebookName.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'DD-MM-YY-HH-mm')}`
    
    return { doc, fileName }
  }, [renderEvents, renderTranscriptions, renderPageFooter, convertToStructuredData, renderConversation])

  return { exportToPDF }
}