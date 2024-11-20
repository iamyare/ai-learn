import { DialogEntry } from '@/types/speechRecognition'
import { useCallback } from 'react'
import { useExportStore } from '@/stores/useExportStore'

export const useMarkdownCleaner = () => {
  const { transcriptions: storeTranscriptions } = useExportStore()

  const parseMarkdownContent = useCallback((content: string) => {
    let events: ImportantEventType[] = []
    let markdownContent = content

    // Usar transcripciones directamente del store
    const transcriptions = storeTranscriptions

    // Eliminar la sección completa de transcripciones incluyendo todo su contenido
    markdownContent = markdownContent.replace(/## Transcripciones\n\n([\s\S]*?)(?=##|$)/i, '')

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

    // Limpiar el resto del contenido y asegurar que no queden residuos de transcripciones
    markdownContent = markdownContent
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\*\*AI\*\*:\s*\n/g, '')
      .replace(/### \d{1,2} \w{3} \d{4}[\s\S]*?(?=###|$)/g, '') // Eliminar cualquier transcripción residual
      .trim()

    return { events, transcriptions, markdownContent }
  }, [storeTranscriptions])

  return { parseMarkdownContent }
}