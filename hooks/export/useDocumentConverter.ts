
import { useCallback } from 'react'
import { useExportStore } from '@/stores/useExportStore'
import { format } from '@formkit/tempo'

interface DocumentSection {
  type: 'title' | 'pdf' | 'transcriptions' | 'events' | 'conversation'
  content: any
}

interface DocumentData {
  metadata: {
    title: string
    date: string
    exportDate: string
  }
  sections: DocumentSection[]
}

export const useDocumentConverter = () => {
  const { messages, pdfUrl, transcriptions } = useExportStore()

  const convertToStructuredData = useCallback((notebookName: string): DocumentData => {
    const currentDate = new Date()
    
    const data: DocumentData = {
      metadata: {
        title: notebookName,
        date: format(currentDate, 'full'),
        exportDate: format(currentDate, 'YYYY-MM-DD HH:mm:ss')
      },
      sections: []
    }

    // Agregar contenido PDF si existe
    if (pdfUrl) {
      data.sections.push({
        type: 'pdf',
        content: pdfUrl
      })
    }

    // Agregar transcripciones si existen
    if (transcriptions.length > 0) {
      data.sections.push({
        type: 'transcriptions',
        content: transcriptions.map(t => ({
          timestamp: t.timestamp,
          page: t.page || 0,
          text: t.text
        }))
      })
    }

    // Procesar mensajes y eventos
    if (messages.length > 0) {
      const events: ImportantEventType[] = []
      const conversation: any[] = []

      messages.forEach(msg => {
        if ('events' in msg) {
          events.push(...msg.events)
        } else if ('text' in msg) {
          conversation.push({
            role: msg.isUser ? 'Usuario' : 'AI',
            content: msg.text
          })
        }
      })

      if (events.length > 0) {
        data.sections.push({
          type: 'events',
          content: events
        })
      }

      if (conversation.length > 0) {
        data.sections.push({
          type: 'conversation',
          content: conversation
        })
      }
    }

    return data
  }, [messages, pdfUrl, transcriptions])

  return { convertToStructuredData }
}