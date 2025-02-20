import CopyButton from '@/components/ui/copy-button'
import { MarkdownRenderer } from '@/components/ui/markdown-reader'
import React, { useEffect, useState, useRef } from 'react'

const MessageContent: React.FC<{ content: string }> = ({ content }) => {
  const [renderedContent, setRenderedContent] = useState<React.ReactNode>(null)
  const lastContentRef = useRef(content)
  const isStreamingRef = useRef(false)

  useEffect(() => {
    // Detectar si estamos en modo streaming
    if (content !== lastContentRef.current) {
      isStreamingRef.current = true
    }

    const renderContent = async () => {
      try {
        // Si el contenido está vacío y estamos streaming, no mostrar nada
        if (!content && isStreamingRef.current) {
          return
        }

        // Renderizar el contenido usando Markdown
        const rendered = <MarkdownRenderer content={content} />
        setRenderedContent(rendered)
        lastContentRef.current = content

        // Si el contenido no está vacío, ya no estamos en streaming inicial
        if (content) {
          isStreamingRef.current = false
        }
      } catch (error) {
        console.error('Error rendering markdown:', error)
        // Fallback a texto plano si hay error
        setRenderedContent(<pre className="whitespace-pre-wrap">{content}</pre>)
      }
    }
    
    // Usar requestAnimationFrame para mejor rendimiento en actualizaciones frecuentes
    requestAnimationFrame(() => {
      renderContent()
    })
  }, [content])

  // Si no hay contenido y no estamos streaming, retornar null
  if (!content && !isStreamingRef.current) {
    return null
  }

  return (
    <div className="relative">
      <div className="min-h-[20px]">
        {renderedContent}
      </div>
      <div className="absolute top-0 right-0">
        <CopyButton content={content} />
      </div>
    </div>
  )
}

export default React.memo(MessageContent)
