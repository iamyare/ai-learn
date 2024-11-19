import { useCallback } from 'react'
import { jsPDF } from 'jspdf'
import { useMarkdownExport } from './useMarkdownExport'
import { useEventsPDFRenderer } from './useEventsPDFRenderer'
import { useMarkdownCleaner } from './useMarkdownCleaner'
import { useMarkdownConverter } from './useMarkdownConverter'
import { usePageFooter } from './usePageFooter'
import { format } from '@formkit/tempo'

interface PDFExportConfig {
  pageSize: 'a4' | 'letter' | 'legal' | 'tabloid'
  orientation: 'portrait' | 'landscape'
  notebookName: string // Añadimos el nombre del notebook
}

export const usePDFExport = () => {
  const { exportToMarkdown } = useMarkdownExport()
  const { renderEvents } = useEventsPDFRenderer()
  const { parseMarkdownContent } = useMarkdownCleaner()
  const { convertToPlainText } = useMarkdownConverter()
  const { renderPageFooter } = usePageFooter()

  const exportToPDF = useCallback(async (config: PDFExportConfig) => {
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

    // Contenido del markdown
    const markdown = exportToMarkdown()
    const { events, markdownContent } = parseMarkdownContent(markdown)
    const textContent = convertToPlainText(markdownContent)

    // Renderizar eventos usando el nuevo hook
    if (events.length > 0) {
      currentY = renderEvents(doc, events, currentY, margin, pageWidth, pageHeight)
      currentY += 10
    }

    // Renderizar contenido del markdown
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(44, 62, 80)

    const lines = textContent.split('\n')
    lines.forEach((line) => {
      const textLines = doc.splitTextToSize(line, textWidth)
      
      textLines.forEach((textLine: string) => {
        // Verificar si necesitamos nueva página, considerando el footer
        if (currentY > pageHeight - margin - footerSpace - 7) { // Añadimos el espacio de línea
          doc.addPage()
          currentY = margin
        }

        // Renderizar línea de texto
        doc.setFontSize(12)
        doc.setTextColor(44, 62, 80)
        doc.text(textLine, margin, currentY)
        currentY += 7 // Espaciado entre líneas
      })

      // Solo añadir espacio extra si no estamos cerca del final de la página
      if (currentY < pageHeight - margin - footerSpace - 10) {
        currentY += 3
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
  }, [exportToMarkdown, renderEvents, parseMarkdownContent, convertToPlainText, renderPageFooter])

  return { exportToPDF }
}