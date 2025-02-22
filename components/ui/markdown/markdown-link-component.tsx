import React from 'react'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string
  children?: React.ReactNode
}

export const MarkdownLink = React.memo(({ href, children, ...props }: LinkProps) => {
  const isExternal = href?.startsWith('http') || href?.startsWith('https')
  
  return isExternal ? (
    <a
      href={href}
      className="inline-flex items-center gap-1 text-blue-500 hover:underline transition-colors duration-200"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${children} (abre en nueva ventana)`}
      {...props}
    >
      {children}
      <ExternalLink className="inline-block w-3 h-3 opacity-70" aria-hidden="true" />
    </a>
  ) : (
    <Link
      href={href || ''}
      className="inline-flex items-center gap-1 text-primary hover:underline transition-colors duration-200"
      {...props}
    >
      {children}
    </Link>
  )
})

MarkdownLink.displayName = 'MarkdownLink'