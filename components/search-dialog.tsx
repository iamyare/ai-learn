'use client'
import { Calculator, Calendar, Smile } from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { useEffect, useState } from 'react'

export default function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSearch = (value: string) => {
    setSearchValue(value)
    console.log('Búsqueda:', value)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder='Buscar notebooks o folders'
        onValueChange={handleSearch}
        value={searchValue}
      />
      <CommandList>
        <CommandEmpty>No hay resultados</CommandEmpty>
        <CommandGroup heading='Resultados'>
          <CommandItem>
            <Calendar />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <Calculator />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
