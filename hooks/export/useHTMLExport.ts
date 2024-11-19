
import { useCallback } from 'react'
import { useMarkdownExport } from './useMarkdownExport'
import { marked } from 'marked'

export const useHTMLExport = () => {
  const { exportToMarkdown } = useMarkdownExport()

  const exportToHTML = useCallback(() => {
    const markdown = exportToMarkdown()
    const htmlContent = marked(markdown)

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Notebook Export</title>
          <style>
            body { 
              font-family: system-ui;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              line-height: 1.6;
            }
            pre {
              background: #f4f4f4;
              padding: 1em;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `
  }, [exportToMarkdown])

  return { exportToHTML }
}