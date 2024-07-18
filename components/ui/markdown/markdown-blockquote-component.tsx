import React from 'react'

export const Blockquote = ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
  <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic" {...props}>{children}</blockquote>
)