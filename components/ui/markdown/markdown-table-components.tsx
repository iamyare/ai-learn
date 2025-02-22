import React from 'react'

export const Table = React.memo(({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-x-auto my-4">
    <table className="min-w-full divide-y divide-border" {...props}>
      {children}
    </table>
  </div>
))

export const TableRow = React.memo(({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className="border-b border-border last:border-0" {...props}>
    {children}
  </tr>
))

export const TableCell = React.memo(({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => {
  const isHeader = props.role === 'columnheader' || props.role === 'rowheader'
  
  return isHeader ? (
    <th 
      className="px-4 py-2 text-left font-medium bg-muted/50" 
      {...props}
    >
      {children}
    </th>
  ) : (
    <td 
      className="px-4 py-2" 
      {...props}
    >
      {children}
    </td>
  )
})

Table.displayName = 'Table'
TableRow.displayName = 'TableRow'
TableCell.displayName = 'TableCell'