import CopyButton from '@/components/ui/copy-button'
import { MarkdownRenderer } from '@/components/ui/markdown-reader'
import React, { useEffect, useState, useRef } from 'react'

const MessageContent: React.FC<{ content: string }> = ({ content }) => {
  const [renderedContent, setRenderedContent] = useState<React.ReactNode>('')
  const lastContentRef = useRef(content)

  useEffect(() => {
    // Solo renderizar si el contenido ha cambiado
    if (content !== lastContentRef.current) {
      const renderContent = async () => {
        try {
          const rendered = <MarkdownRenderer content={content} />
          setRenderedContent(rendered)
          lastContentRef.current = content
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
    }
  }, [content])

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
