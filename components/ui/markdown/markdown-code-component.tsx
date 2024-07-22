import React from 'react'

type CodeProps = {
  inline?: boolean
  className?: string
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLElement>

export const Code = ({ inline, className, children, ...props }: CodeProps) => {
  const match = /language-(\w+)/.exec(className || '')
  return !inline ? (
    <pre className="bg-muted text-primary border w-fit rounded px-2 py-1 my-2 overflow-x-auto">
      <code className={`language-${match?.[1] || ''}`} {...props}>
        {children}
      </code>
    </pre>
  ) : (
    <code className="bg-muted rounded px-1" {...props}>
      {children}
    </code>
  )
}