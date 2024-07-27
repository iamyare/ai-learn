'use client'

import * as React from "react"
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { MoreVertical } from "lucide-react"

const options = [
  { value: 'copy', label: 'Copiar Transcripcion' },
  { value: 'copy-no-transcript', label: 'Copiar Transcripcion sin fecha' },
  { value: 'delete', label: 'Eliminar Transcripcion' },
]

const hiddenTranscription = [
  { value: 'date', label: 'Fecha' },
  { value: 'time', label: 'Hora' },
  { value: 'page', label: 'Pagina' },
]

type Checked = string[]

export function MoreOptionsTranscript() {
  const [checkedItems, setCheckedItems] = React.useState<Checked>(
    hiddenTranscription.map(option => option.value)
  )

  const handleChange = (value: string) => {
    setCheckedItems((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={'icon'} variant="ghost">
          <MoreVertical className=' text-muted-foreground size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuItem key={option.value}>
            {option.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Visualizar</DropdownMenuLabel>
        {hiddenTranscription.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={checkedItems.includes(option.value)}
            onCheckedChange={() => handleChange(option.value)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}