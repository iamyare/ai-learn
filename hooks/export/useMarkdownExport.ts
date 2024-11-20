import { useCallback } from 'react'
import { useExportStore } from '@/stores/useExportStore'
import { format } from '@formkit/tempo'

export const useMarkdownExport = () => {
  const { messages, pdfUrl, transcriptions } = useExportStore()

  const exportToMarkdown = useCallback(() => {
    const date = format(new Date(), 'full')
    let markdown = `# Exportación del Notebook\n\n`
    markdown += `Fecha: ${date}\n\n`

    // ...existing code for markdown generation using direct store data...

    return markdown
  }, [messages, pdfUrl, transcriptions])

  return { exportToMarkdown }
}