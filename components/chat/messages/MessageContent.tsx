import CopyButton from '@/components/ui/copy-button'
import { MarkdownRenderer } from '@/components/ui/markdown-reader'
import React, { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface MessageContentProps {
  content: string
  onCopy?: () => void
  className?: string
}

const MessageContent: React.FC<MessageContentProps> = ({
  content,
  onCopy,
  className
}) => {
  const [renderedContent, setRenderedContent] = useState<React.ReactNode>(null)
  const lastContentRef = useRef(content)
  const isStreamingRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (content !== lastContentRef.current) {
      isStreamingRef.current = true
    }

    const renderContent = async () => {
      try {
        if (!content && isStreamingRef.current) {
          return
        }

        const rendered = (
          <motion.div
            initial={isStreamingRef.current ? { opacity: 0.5 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <MarkdownRenderer content={content} />
          </motion.div>
        )
        
        setRenderedContent(rendered)
        lastContentRef.current = content

        if (content) {
          isStreamingRef.current = false
        }
      } catch (error) {
        console.error('Error rendering markdown:', error)
        setRenderedContent(
          <pre className="whitespace-pre-wrap text-destructive">
            {content}
          </pre>
        )
      }
    }
    
    requestAnimationFrame(() => {
      renderContent()
    })
  }, [content])

  if (!content && !isStreamingRef.current) {
    return null
  }

  return (

      <div className="min-h-[20px] prose prose-sm dark:prose-invert max-w-none">
        <AnimatePresence mode="wait">
          {renderedContent}
        </AnimatePresence>
      </div>


  )
}

export default React.memo(MessageContent)
