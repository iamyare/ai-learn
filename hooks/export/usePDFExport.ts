import { useCallback } from 'react'
import { jsPDF } from 'jspdf'
import { useMarkdownExport } from './useMarkdownExport'
import { format } from '@formkit/tempo'

interface PDFExportConfig {
  pageSize: 'a4' | 'letter' | 'legal' | 'tabloid'
  orientation: 'portrait' | 'landscape'
  notebookName: string // Añadimos el nombre del notebook
}

export const usePDFExport = () => {
  const { exportToMarkdown } = useMarkdownExport()

  const renderEvents = (doc: jsPDF, events: ImportantEventType[], startY: number, margin: number, pageWidth: number, pageHeight: number) => {
    let y = startY
    const textWidth = pageWidth - (2 * margin)

    // Ordenar eventos por fecha
    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // Agrupar eventos por tipo
    const eventGroups = sortedEvents.reduce((groups, event) => {
      const match = event.title.match(/\*\*([^*]+)\*\*/)
      const groupName = match ? match[1].trim() : 'Otros Eventos'
      if (!groups[groupName]) groups[groupName] = []
      groups[groupName].push(event)
      return groups
    }, {} as Record<string, ImportantEventType[]>)

    // Renderizar eventos por grupos
    Object.entries(eventGroups).forEach(([groupName, groupEvents]) => {
      // Verificar espacio para nuevo grupo
      if (y > pageHeight - margin - 20) {
        doc.addPage()
        y = margin + 15
      }

      // Título del grupo
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(44, 62, 80)
      doc.text(groupName, margin, y)
      y += 10

      // Renderizar eventos del grupo
      groupEvents.forEach((event) => {
        // Verificar si necesitamos una nueva página
        if (y > pageHeight - margin - 40) {
          doc.addPage()
          y = margin + 15
        }

        // Dibujar el fondo del evento
        doc.setFillColor(248, 249, 250)
        doc.roundedRect(margin, y - 5, textWidth, 40, 3, 3, 'F')

        // Título del evento
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(52, 73, 94)
        doc.text(event.title, margin + 5, y + 5)

        // Descripción
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(74, 85, 104)
        const description = doc.splitTextToSize(event.description, textWidth - 10)
        doc.text(description, margin + 5, y + 15)

        // Fecha y prioridad
        doc.setFontSize(9)
        doc.setTextColor(127, 140, 141)
        const fecha = format(new Date(event.date), 'DD/MM/YY HH:mm A')
        doc.text(`Fecha: ${fecha}`, margin + 5, y + 30)
        doc.text(`Prioridad: ${event.priority}`, textWidth - 30, y + 30)

        y += 50 // Espacio para el siguiente evento
      })

      y += 10 // Espacio extra entre grupos
    })

    return y // Retornar la última posición Y
  }

  const parseMarkdownContent = (content: string) => {
    let events: ImportantEventType[] = []
    let markdownContent = content

    // Buscar contenido de eventos en el markdown
    const eventsMatch = content.match(/\*\*AI - Eventos\*\*:\s*(\[[\s\S]*?\])/m)
    if (eventsMatch) {
      try {
        events = JSON.parse(eventsMatch[1])
        // Remover la sección de eventos del markdown
        markdownContent = content.replace(eventsMatch[0], '')
      } catch (e) {
        console.error('Error parsing events:', e)
      }
    }

    return { events, markdownContent }
  }

  const exportToPDF = useCallback(async (config: PDFExportConfig) => {
    const content = exportToMarkdown()
    const { events, markdownContent } = parseMarkdownContent(content)

    const doc = new jsPDF({
      orientation: config.orientation as 'portrait' | 'landscape',
      unit: 'mm',
      format: config.pageSize
    })

    // Configurar fuente y tamaños
    doc.setFont('helvetica')
    const fontSize = 11
    doc.setFontSize(fontSize)

    // Configurar márgenes
    const margin = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const textWidth = pageWidth - (2 * margin)

    // Añadir cabecera con nombre del notebook
    doc.setFontSize(16)
    doc.setTextColor(44, 62, 80)
    doc.text(config.notebookName, margin, margin)
    doc.setFontSize(fontSize)
    
    // Añadir fecha
    const date = new Date().toLocaleDateString()
    doc.setTextColor(127, 140, 141) // Color gris para la fecha
    doc.text(date, pageWidth - margin - doc.getTextWidth(date), margin)
    
    // Línea separadora
    doc.setDrawColor(189, 195, 199)
    doc.line(margin, margin + 5, pageWidth - margin, margin + 5)

    // Restaurar color de texto para el contenido
    doc.setTextColor(52, 73, 94)

    // Si hay eventos, renderizarlos primero
    let y = margin + 15
    if (events.length > 0) {
      y = renderEvents(doc, events, y, margin, pageWidth, pageHeight)
      y += 10 // Espacio extra después de los eventos
    }

    // Renderizar el resto del contenido markdown
    const splitText = doc.splitTextToSize(markdownContent, textWidth)
    
    splitText.forEach((line: string) => {
      // Verificar si necesitamos una nueva página
      if (y > pageHeight - margin) {
        doc.addPage()
        y = margin + 15

        // Añadir número de página
        doc.setFontSize(9)
        doc.setTextColor(127, 140, 141)
        const pageNumber = `Página ${doc.getNumberOfPages()}`
        doc.text(pageNumber, pageWidth / 2, pageHeight - 10, { align: 'center' })
        doc.setFontSize(fontSize)
        doc.setTextColor(52, 73, 94)
      }

      // Detectar y aplicar estilos para títulos
      if (line.startsWith('#')) {
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        y += 5 // Espacio extra antes de títulos
      } else {
        doc.setFontSize(fontSize)
        doc.setFont('helvetica', 'normal')
      }

      doc.text(line, margin, y)
      y += 7 // Espaciado entre líneas
    })

    // Añadir número de página en la última página
    doc.setFontSize(9)
    doc.setTextColor(127, 140, 141)
    const pageNumber = `Página ${doc.getNumberOfPages()}`
    doc.text(pageNumber, pageWidth / 2, pageHeight - 10, { align: 'center' })

    // Configurar nombre del archivo
    const fileName = `${config.notebookName.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'DD-MM-YY-HH-mm')}`
    doc.setProperties({
      title: config.notebookName,
      subject: 'Exported Notebook',
      creator: 'AI Learn Platform',
      author: 'AI Learn',
      keywords: 'notebook,export,ai-learn'
    })

    return { doc, fileName }
  }, [exportToMarkdown])

  return { exportToPDF }
}