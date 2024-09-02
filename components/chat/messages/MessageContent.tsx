import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "@/components/ui/markdown-reader"
import { Check, Copy } from "lucide-react"
import React, { useCallback, useEffect, useState } from "react"

const MessageContent: React.FC<{ content: string }> = (
    ({ content }) => {
      const [renderedContent, setRenderedContent] = useState<React.ReactNode>('')
      const [isCopied, setIsCopied] = useState(false)
  
      useEffect(() => {
        const renderContent = async () => {
          const rendered = await new Promise<React.ReactNode>((resolve) =>
            setTimeout(() => resolve(<MarkdownRenderer content={content} />), 10)
          )
          setRenderedContent(rendered)
        }
        renderContent()
      }, [content])
  
      const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(content)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      }, [content])
  
      return (
        <>
          {renderedContent}
          <Button
            size='icon'
            variant='outline'
            className='absolute bottom-0 translate-y-1/2 right-5 size-fit p-2.5 transition-transform active:scale-95'
            onClick={handleCopy}
          >
            {isCopied ? (
              <Check className='size-3' />
            ) : (
              <Copy className='size-3' />
            )}
          </Button>
        </>
      )
    }
  )
  
export default MessageContent