import React from 'react'

export const UnorderedList = ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className="list-disc list-inside my-2" {...props}>{children}</ul>
)

export const OrderedList = ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
  <ol className="list-decimal list-inside my-2" {...props}>{children}</ol>
)

export const ListItem = ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
  <li className="my-1" {...props}>{children}</li>
)