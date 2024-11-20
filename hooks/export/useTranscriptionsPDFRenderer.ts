import { jsPDF } from 'jspdf'
import { format } from '@formkit/tempo'
import { DialogEntry } from '@/types/speechRecognition'

export const useTranscriptionsPDFRenderer = () => {
  const formatTimeStamp = (date: Date): string => {
    const hours = Math.floor(date.getHours())
    const minutes = Math.floor(date.getMinutes())
    const seconds = Math.floor(date.getSeconds())
    return `[${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}]`
  }

  const groupByDate = (transcriptions: DialogEntry[]): Map<string, DialogEntry[]> => {
    const groups = new Map<string, DialogEntry[]>()
    
    transcriptions.forEach(trans => {
      const date = format(new Date(trans.timestamp), 'long')
      if (!groups.has(date)) {
        groups.set(date, [])
      }
      groups.get(date)?.push(trans)
    })
    
    return groups
  }

  const renderTranscriptions = (
    doc: jsPDF,
    transcriptions: DialogEntry[],
    startY: number,
    margin: number,
    pageWidth: number,
    pageHeight: number,
    showTimestamp: boolean = true
  ) => {
    const textWidth = pageWidth - (2 * margin)
    let y = startY

    if (transcriptions.length === 0) return y

    // Título principal
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(44, 62, 80)
    doc.text('Transcripciones', margin, y + 8)
    y += 15

    const dateGroups = groupByDate(transcriptions)

    dateGroups.forEach((groupTranscriptions, date) => {
      // Título de la fecha
      if (y + 40 > pageHeight - margin) {
        doc.addPage()
        y = margin + 10
      }

      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text(date, margin, y + 10)
      y += 20

      let combinedText = ''
      groupTranscriptions.forEach(trans => {
        combinedText += showTimestamp 
          ? `${formatTimeStamp(new Date(trans.timestamp))} ${trans.text}\n`
          : `${trans.text}\n`
      })

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      const textLines = doc.splitTextToSize(combinedText, textWidth)

      if (y + (textLines.length * 7) > pageHeight - margin) {
        doc.addPage()
        y = margin + 10
      }

      doc.setTextColor(44, 62, 80)
      doc.text(textLines, margin, y)
      y += textLines.length * 7 + 15
    })

    return y
  }

  return { renderTranscriptions }
}