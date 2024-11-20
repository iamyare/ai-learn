'use client'
import { Calendar, LoaderCircle, Search, Smile } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { useEffect, useState } from 'react'
import { searchFoldersAndNotebooks } from '@/actions'
import { useUserStore } from '@/stores/useUserStore'
import { useToast } from './ui/use-toast'
import { cn } from '@/lib/utils'

export default function SearchDialog() {
  const { user } = useUserStore()
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [results, setResults] = useState<SearchByName[]>([])
  const [isloading, setLoading] = useState(false)

  const { toast } = useToast()

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

  const debouncedSearch = useDebouncedCallback(async (value: string) => {
    try {
      setLoading(true)
      const { searchResults, errorSearchResults } =
        await searchFoldersAndNotebooks({
          name: value,
          userId: user?.id || ''
        })

      if (errorSearchResults) {
        toast({
          title: 'Error',
          description: 'Error al realizar la búsqueda',
          variant: 'destructive'
        })
        setResults([])
        return
      }

      setResults(searchResults || [])
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Error al realizar la búsqueda',
        variant: 'destructive'
      })
      setResults([])
    } finally {
      setLoading(false)
    }
  }, 300)

  const handleSearch = (value: string) => {
    setSearchValue(value)
    debouncedSearch(value)
  }

  if (!user) return null

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className='flex items-center border-b px-3' cmdk-input-wrapper=''>
        {isloading ? (
          <LoaderCircle className='mr-2 h-4 w-4 shrink-0 animate-spin opacity-50' />
        ) : (
          <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
        )}
        <input
          className={cn(
            'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
          )}
          placeholder='Buscar notebooks o folders'
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <CommandList>
        {results.length === 0 && searchValue ? (
          <CommandEmpty>No hay resultados</CommandEmpty>
        ) : (
          <CommandGroup heading='Resultados'>
            {results.map((result, index) => (
              <CommandItem key={index}>
                {result.type === 'notebook' ? <Calendar /> : <Smile />}
                <span>{result.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
