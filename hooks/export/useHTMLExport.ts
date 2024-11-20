import { useCallback } from 'react'
import { useMarkdownExport } from './useMarkdownExport'
import { marked } from 'marked'
import { useDocumentConverter } from './useDocumentConverter'
import { format } from '@formkit/tempo'

export const useHTMLExport = () => {
  const { convertToStructuredData } = useDocumentConverter()

  const exportToHTML = useCallback((notebookName: string) => {
    const data = convertToStructuredData(notebookName)
    
    const content = `
      <div class="notebook">
        <h1>${data.metadata.title}</h1>
        <p class="date">${data.metadata.date}</p>
        ${data.sections.map(section => {
          switch(section.type) {
            case 'transcriptions':
              return `
                <section class="transcriptions">
                  <h2>Transcripciones</h2>
                  ${section.content.map((t: any) => `
                    <div class="transcription">
                      <div class="timestamp">${format(new Date(t.timestamp), 'DD MMM YYYY HH:mm:ss')}</div>
                      <div class="text">${t.text}</div>
                    </div>
                  `).join('')}
                </section>
              `
            // ...resto de casos
          }
        }).join('')}
      </div>
    `

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${data.metadata.title}</title>
          <style>
            body { 
              font-family: system-ui;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              line-height: 1.6;
            }
            // ...existing styles...
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `
  }, [convertToStructuredData])

  return { exportToHTML }
}