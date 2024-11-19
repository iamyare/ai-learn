
import { useCallback } from 'react'

export const useMarkdownCleaner = () => {
  const parseMarkdownContent = useCallback((content: string) => {
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
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\*\*AI\*\*:\s*\n/g, '')
      .trim()

    return { events, markdownContent }
  }, [])

  return { parseMarkdownContent }
}