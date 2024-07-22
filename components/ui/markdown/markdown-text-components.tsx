import React from 'react'

export const Paragraph = ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className="my-2" {...props}>{children}</p>
)

export const Strong = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <strong className=" font-semibold" {...props}>{children}</strong>
)

export const Emphasis = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <em className="italic" {...props}>{children}</em>
)