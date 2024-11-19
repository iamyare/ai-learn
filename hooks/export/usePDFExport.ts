import { useCallback } from 'react'
import { jsPDF } from 'jspdf'
import { useMarkdownExport } from './useMarkdownExport'
import { useEventsPDFRenderer } from './useEventsPDFRenderer'
import { format } from '@formkit/tempo'

interface PDFExportConfig {
  pageSize: 'a4' | 'letter' | 'legal' | 'tabloid'
  orientation: 'portrait' | 'landscape'
  notebookName: string // Añadimos el nombre del notebook
}

export const usePDFExport = () => {
  const { exportToMarkdown } = useMarkdownExport()
  const { renderEvents } = useEventsPDFRenderer()

  const parseMarkdownContent = (content: string) => {
    let events: ImportantEventType[] = []
    let markdownContent = content

    // Buscar y eliminar la sección completa de eventos del markdown
    const eventsSection = content.match(/## Eventos[\s\S]*?(?=##|$)/i)
    if (eventsSection) {
      markdownContent = content.replace(eventsSection[0], '')
    }

    // Buscar y extraer eventos de la sección de conversación
    const eventsInConversation = content.match(/\*\*AI - Eventos\*\*:\s*(\[[\s\S]*?\])/gm)
    if (eventsInConversation) {
      eventsInConversation.forEach(match => {
        try {
          const matchResult = match.match(/\*\*AI - Eventos\*\*:\s*(\[[\s\S]*?\])/)
          const eventData = matchResult ? matchResult[1] : ''
          const parsedEvents = JSON.parse(eventData)
          events = [...events, ...parsedEvents]
          // Eliminar este evento de la sección de conversación
          markdownContent = markdownContent.replace(match, '')
        } catch (e) {
          console.error('Error parsing events from conversation:', e)
        }
      })
    }

    // Limpiar sección de conversación
    markdownContent = markdownContent
      // Eliminar líneas vacías extras
      .replace(/\n{3,}/g, '\n\n')
      // Eliminar líneas que solo contienen "AI:" sin contenido
      .replace(/\*\*AI\*\*:\s*\n/g, '')
      .trim()

    return { events, markdownContent }
  }

const convertMarkdownToText = (markdown: string): string => {
    return markdown
      // Eliminar encabezados manteniendo el texto
      .replace(/^#{1,6}\s+(.*$)/gm, '$1')
      // Eliminar énfasis manteniendo el texto
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Eliminar enlaces manteniendo el texto
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
      // Eliminar imágenes
      .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '')
      // Eliminar bloques de código (tanto multilínea como inline)
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      // Eliminar líneas en blanco extras
      .replace(/\n\s*\n/g, '\n\n')
      .trim()
}
    
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
  const textContent = convertMarkdownToText(markdownContent)

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
      // Verificar si necesitamos nueva página
      if (currentY > pageHeight - margin) {
        doc.addPage()
        currentY = margin
        
        // Agregar número de página
        doc.setFontSize(10)
        doc.setTextColor(128, 128, 128)
        const pageNumber = doc.getNumberOfPages()
        doc.text(`Página ${pageNumber}`, pageWidth - margin, pageHeight - 10)
      }

      // Renderizar línea de texto
      doc.setFontSize(12)
      doc.setTextColor(44, 62, 80)
      doc.text(textLine, margin, currentY)
      currentY += 7 // Espaciado entre líneas
    })

    currentY += 3 // Espaciado extra entre párrafos
  })

  // Agregar número en la última página
  const pageNumber = doc.getNumberOfPages()
  doc.setFontSize(10)
  doc.setTextColor(128, 128, 128)
  doc.text(`Página ${pageNumber}`, pageWidth - margin, pageHeight - 10)

  const fileName = `${config.notebookName.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'DD-MM-YY-HH-mm')}`
  
  return { doc, fileName }
}, [exportToMarkdown, renderEvents])

  return { exportToPDF }
}