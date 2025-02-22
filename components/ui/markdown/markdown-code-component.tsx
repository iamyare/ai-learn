import React, { useCallback, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Copy, Check } from 'lucide-react'

type CodeProps = {
  inline?: boolean
  className?: string
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLElement>

const CopyButton = ({ text }: { text: string }) => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }, [text])

  return (
    <button
      className="absolute right-2 top-2 p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors"
      onClick={copyToClipboard}
      aria-label={isCopied ? 'Código copiado' : 'Copiar código'}
    >
      {isCopied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  )
}

export const Code = React.memo(({ inline, className, children, ...props }: CodeProps) => {
  const match = /language-(\w+)/.exec(className || '')
  const language = match?.[1] || ''
  const content = String(children).replace(/\n$/, '')

  if (inline) {
    return (
      <code
        className="bg-muted rounded px-1 py-0.5 text-sm"
        {...props}
      >
        {children}
      </code>
    )
  }

  return (
    <div className="relative group" role="region" aria-label={`Bloque de código ${language}`}>
      {language && (
        <div className="absolute left-4 top-0 -translate-y-full bg-muted text-xs px-2 py-1 rounded-t">
          {language}
        </div>
      )}
      <SyntaxHighlighter
        {...props}
        style={oneDark}
        language={language}
        PreTag="div"
        className="!mt-0 !bg-muted relative rounded-lg"
        customStyle={{
          margin: 0,
          padding: '1.5rem 1rem',
          backgroundColor: 'var(--muted)',
        }}
      >
        {content}
      </SyntaxHighlighter>
      <CopyButton text={content} />
    </div>
  )
})

Code.displayName = 'Code'