import React from 'react'

export const Link = ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a href={href} className="text-blue-500 hover:underline" {...props}>{children}</a>
)