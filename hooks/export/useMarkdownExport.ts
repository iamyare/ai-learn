import { useCallback } from 'react'
import { useExportStore } from '@/stores/useExportStore'
import { format } from '@formkit/tempo'

export const useMarkdownExport = () => {
  const { messages, pdfUrl, transcriptions } = useExportStore()

  const exportToMarkdown = useCallback(() => {
    const date = format(new Date(), 'full')
    let markdown = `# Exportación del Notebook\n\n`
    markdown += `Fecha: ${date}\n\n`

    if (pdfUrl) {
      markdown += `## Contenido del PDF\n\n${pdfUrl}\n\n`
    }

    if (transcriptions.length > 0) {
      markdown += `## Transcripciones\n\n`
      transcriptions.forEach(t => {
        const date = new Date(t.timestamp)
        const formattedDate = format(date, 'DD MMM YYYY').toLowerCase()
        const formattedTime = format(date, 'HH:mm:ss')
        
        markdown += `### ${formattedDate} - ${formattedTime}`
        if (t.page) {
          markdown += ` - Página ${t.page}`
        }
        markdown += `\n${t.text}\n\n`
      })
    }

    if (messages.length > 0) {
      markdown += `## Conversación\n\n`
      messages.forEach(msg => {
        const role = msg.isUser ? 'Usuario' : 'AI'
        if ('text' in msg) {
          markdown += `**${role}**: ${msg.text}\n\n`
        } else if ('events' in msg) {
          markdown += `**${role} - Eventos**:\n${JSON.stringify(msg.events, null, 2)}\n\n`
        } else if ('mindMap' in msg) {
          markdown += `**${role} - Mapa Mental**:\n${JSON.stringify(msg.mindMap, null, 2)}\n\n`
        }
      })
    }

    return markdown
  }, [messages, pdfUrl, transcriptions])

  return { exportToMarkdown }
}