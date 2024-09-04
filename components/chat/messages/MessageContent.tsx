import CopyButton from '@/components/ui/copy-button'
import { MarkdownRenderer } from '@/components/ui/markdown-reader'

import React, { useEffect, useState } from 'react'

const MessageContent: React.FC<{ content: string }> = ({ content }) => {
  const [renderedContent, setRenderedContent] = useState<React.ReactNode>('')

  useEffect(() => {
    const renderContent = async () => {
      const rendered = await new Promise<React.ReactNode>((resolve) =>
        setTimeout(() => resolve(<MarkdownRenderer content={content} />), 10)
      )
      setRenderedContent(rendered)
    }
    renderContent()
  }, [content])

  return (
    <>
      {renderedContent}
      <CopyButton content={content} />
    </>
  )
}

export default MessageContent
