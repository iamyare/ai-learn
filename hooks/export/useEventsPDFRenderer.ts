import { jsPDF } from 'jspdf'
import { format } from '@formkit/tempo'

export const useEventsPDFRenderer = () => {

  const renderEvents = (
    doc: jsPDF,
    events: ImportantEventType[],
    startY: number,
    margin: number,
    pageWidth: number,
    pageHeight: number
  ) => {
    const textWidth = pageWidth - (2 * margin)
    const footerSpace = 15 // Espacio reservado para pie de página
    let y = startY

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
      // Verificar espacio para nuevo grupo considerando el footer
      if (y > pageHeight - margin - footerSpace - 20) {
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
        // Verificar espacio considerando el footer
        if (y > pageHeight - margin - footerSpace - 40) {
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

  return { renderEvents }
}