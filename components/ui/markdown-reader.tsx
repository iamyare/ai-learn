import ReactMarkdown, { Components } from 'react-markdown'

import { H1, H2, H3 } from '@/components/ui/markdown/markdown-heading-components'
import { Paragraph, Strong, Emphasis } from '@/components/ui/markdown/markdown-text-components'
import { UnorderedList, OrderedList, ListItem } from '@/components/ui/markdown/markdown-list-components'
import { Link } from '@/components/ui/markdown/markdown-link-component'
import { Blockquote } from '@/components/ui/markdown/markdown-blockquote-component'
import { Code } from '@/components/ui/markdown/markdown-code-component'

export const MarkdownRenderer = ({ content }: { content: string }) => {
  const components: Components = {
    h1: H1,
    h2: H2,
    h3: H3,
    p: Paragraph,
    strong: Strong,
    em: Emphasis,
    ul: UnorderedList,
    ol: OrderedList,
    li: ListItem,
    a: Link,
    blockquote: Blockquote,
    code: Code
  }

  return (
    <ReactMarkdown components={components}>
      {content}
    </ReactMarkdown>
  )
}