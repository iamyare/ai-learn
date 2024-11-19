import { jsPDF } from 'jspdf'
import { format } from '@formkit/tempo'
import { DialogEntry } from '@/types/speechRecognition'

export const useTranscriptionsPDFRenderer = () => {
  const renderTranscriptions = (
    doc: jsPDF,
    transcriptions: DialogEntry[],
    startY: number,
    margin: number,
    pageWidth: number,
    pageHeight: number
  ) => {
    const textWidth = pageWidth - (2 * margin)
    const footerSpace = 15
    let y = startY

    if (transcriptions.length === 0) return y;

    // Título de la sección
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(44, 62, 80)
    doc.text('Transcripciones', margin, y + 8)
    y += 20

    transcriptions.forEach((transcription) => {
      if (y > pageHeight - margin - footerSpace - 60) {
        doc.addPage()
        y = margin + 15
      }

      // Calcular altura del texto primero
      const textLines = doc.splitTextToSize(transcription.text, textWidth - 10)
      const textHeight = textLines.length * 7 + 10

      // Contenedor principal de la transcripción
      doc.setFillColor(248, 249, 250)
      doc.roundedRect(margin, y, textWidth, textHeight + 25, 3, 3, 'F')

      // Header (timestamp y página)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(73, 80, 87)
      const timeStamp = format(new Date(transcription.timestamp), 'DD MMM YYYY HH:mm:ss')
      let headerText = timeStamp
      if (transcription.page !== undefined && transcription.page > 0) {
        headerText += ` | Página ${transcription.page}`
      }
      doc.text(headerText, margin + 5, y + 12)

      // Línea separadora sutil
      doc.setDrawColor(233, 236, 239)
      doc.setLineWidth(0.5)
      doc.line(margin + 5, y + 15, margin + textWidth - 5, y + 15)

      // Contenido de la transcripción
      doc.setFontSize(11)
      doc.setTextColor(44, 62, 80)
      doc.text(textLines, margin + 5, y + 25)

      y += textHeight + 35
    })

    return y + 10
  }

  return { renderTranscriptions }
}