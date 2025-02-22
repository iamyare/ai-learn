import React, { Suspense } from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import { H1, H2, H3 } from '@/components/ui/markdown/markdown-heading-components'
import { Paragraph, Strong, Emphasis } from '@/components/ui/markdown/markdown-text-components'
import { UnorderedList, OrderedList, ListItem } from '@/components/ui/markdown/markdown-list-components'
import { MarkdownLink } from '@/components/ui/markdown/markdown-link-component'
import { Blockquote } from '@/components/ui/markdown/markdown-blockquote-component'
import { Code } from '@/components/ui/markdown/markdown-code-component'
import { HTMLAttributes } from 'react'

import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import remarkDirectiveRehype from 'remark-directive-rehype'
import { PageComponent } from './markdown/markdown-extra-component'

// Componentes para tablas con lazy loading
const Table = React.lazy(() => import('./markdown/markdown-table-components').then(mod => ({ default: mod.Table })))
const TableRow = React.lazy(() => import('./markdown/markdown-table-components').then(mod => ({ default: mod.TableRow })))
const TableCell = React.lazy(() => import('./markdown/markdown-table-components').then(mod => ({ default: mod.TableCell })))

// Componentes envueltos con Suspense para lazy loading
const TableWrapper = (props: React.HTMLAttributes<HTMLTableElement>) => (
  <Suspense fallback={<div className="animate-pulse h-20 bg-muted rounded" />}>
    <Table {...props} />
  </Suspense>
)

const TableRowWrapper = (props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <Suspense fallback={<div className="h-8 bg-muted/50" />}>
    <TableRow {...props} />
  </Suspense>
)

const TableCellWrapper = (props: React.HTMLAttributes<HTMLTableCellElement>) => (
  <Suspense fallback={<div className="h-8 w-full bg-muted/30" />}>
    <TableCell {...props} />
  </Suspense>
)

interface MarkdownRendererProps {
  content: string
  className?: string
}

export const MarkdownRenderer = React.memo(({ content, className }: MarkdownRendererProps) => {
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
    a: MarkdownLink,
    blockquote: Blockquote,
    code: Code,
    page: PageComponent,
    // Componentes de tabla
    table: TableWrapper,
    tr: TableRowWrapper,
    td: TableCellWrapper,
    th: TableCellWrapper,
    // Soporte para listas de tareas
    input: ({ type, checked, ...props }) => 
      type === 'checkbox' ? (
        <input
          type="checkbox"
          checked={checked}
          readOnly
          className="mr-2 h-4 w-4 rounded border-gray-300"
          {...props}
        />
      ) : null,
  } as Partial<Components> & {
    page: HTMLAttributes<HTMLElement>
  }

  return (
    <article 
      className={`prose dark:prose-invert max-w-none ${className || ''}`}
      role="article"
      aria-label="Contenido Markdown"
    >
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          remarkDirective,
          remarkDirectiveRehype
        ]}
        components={components}
        skipHtml={false}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
})

MarkdownRenderer.displayName = 'MarkdownRenderer'