import { jsPDF } from 'jspdf'

interface ConversationEntry {
  role: string
  content: string
}

export const useConversationPDFRenderer = () => {
  const renderConversation = (
    doc: jsPDF,
    conversation: ConversationEntry[],
    startY: number,
    margin: number,
    pageWidth: number,
    pageHeight: number
  ) => {
    const textWidth = pageWidth - (2 * margin)
    const footerSpace = 15
    let y = startY

    if (conversation.length === 0) return y

    // Título de la sección
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(44, 62, 80)
    doc.text('Conversación', margin, y + 8)
    y += 20

    conversation.forEach((entry) => {
      // Verificar espacio disponible
      if (y > pageHeight - margin - footerSpace - 40) {
        doc.addPage()
        y = margin + 15
      }

      // Calcular altura del texto
      const textLines = doc.splitTextToSize(entry.content, textWidth - 20)
      const textHeight = textLines.length * 7 + 20

      // Fondo del mensaje
      const fillColor = entry.role === 'Usuario' ? [248, 249, 250] : [240, 247, 254]
      doc.setFillColor(fillColor[0], fillColor[1], fillColor[2])
      doc.roundedRect(margin, y, textWidth, textHeight, 3, 3, 'F')

      // Nombre del rol
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      const textColor = entry.role === 'Usuario' ? [73, 80, 87] : [37, 99, 235]
      doc.setTextColor(textColor[0], textColor[1], textColor[2])
      doc.text(entry.role, margin + 10, y + 12)

      // Contenido del mensaje
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(44, 62, 80)
      doc.text(textLines, margin + 10, y + 25)

      y += textHeight + 10
    })

    return y + 10
  }

  return { renderConversation }
}