'use client'
import { Folder, LoaderCircle, NotebookPen, Search } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { useEffect, useState, useCallback } from 'react'
import { searchFoldersAndNotebooks, getRecentItems } from '@/actions'
import { useUserStore } from '@/stores/useUserStore'
import { useToast } from './ui/use-toast'
import { cn } from '@/lib/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface SearchDialogInterface {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function SearchDialog({ open, setOpen }: SearchDialogInterface) {
  const { user } = useUserStore()
  const [searchValue, setSearchValue] = useState('')
  const [results, setResults] = useState<SearchByName[]>([])
  const [isLoading, setLoading] = useState(false)

  const pathname = usePathname()
  const router = useRouter()
  const params = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [setOpen, open])

  const loadRecentItems = useCallback(async () => {
    try {
      setLoading(true)
      const { recentItems, errorRecentItems } = await getRecentItems({
        userId: user?.id || ''
      })

      if (errorRecentItems) {
        toast({
          title: 'Error',
          description: 'Error al cargar items recientes',
          variant: 'destructive'
        })
        setResults([])
        return
      }

      setResults(recentItems || [])
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Error al cargar items recientes',
        variant: 'destructive'
      })
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [user?.id, toast])

  useEffect(() => {
    if (open && user?.id) {
      loadRecentItems()
    }
  }, [open, user?.id, loadRecentItems])

  const debouncedSearch = useDebouncedCallback(async (value: string) => {
    if (!value.trim()) {
      if (results.length === 0) {
        await loadRecentItems()
      }
      return
    }

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
    if (value.trim()) {
      setLoading(true)
    }
    debouncedSearch(value)
  }

  const handleNavigate = (result: SearchByName) => {
    if (result.type === 'folder') {
      const newParams = new URLSearchParams(params)
      newParams.set('folder_id', result.id)
      newParams.set('folder_name', result.name)
      const newPath = `${pathname}?${newParams.toString()}`
      router.replace(newPath)
    } else {
      router.push(`/${user?.username}/${result.id}`)
    }
    setOpen(false)
  }

  if (!user) return null

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className='flex items-center border-b px-3' cmdk-input-wrapper=''>
        {isLoading ? (
          <LoaderCircle className='mr-2 h-4 w-4 shrink-0 animate-spin opacity-50' />
        ) : (
          <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
        )}
        <input
          className={cn(
            'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
          )}
          placeholder='Buscar notebooks o folders'
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <CommandList>
        {isLoading && searchValue && (
          <CommandGroup heading='Buscando...'>
            {Array.from({ length: 3 }).map((_, index) => (
              <CommandItem
                key={index}
                className='bg-muted animate-pulse h-8 my-2'
              ></CommandItem>
            ))}
          </CommandGroup>
        )}

        {!isLoading && searchValue && results.length === 0 && (
          <CommandEmpty>
            No hay resultados para{' '}
            <span className='font-semibold'>{searchValue}</span>
          </CommandEmpty>
        )}

        {!isLoading && results.length > 0 && (
          <CommandGroup heading={searchValue ? 'Resultados' : 'Recientes'}>
            {results.map((result, index) => (
              <CommandItem
                className='justify-between'
                key={index}
                onSelect={() => handleNavigate(result)}
              >
                <div className='flex items-center space-x-2'>
                  {result.type === 'notebook' ? (
                    <NotebookPen className='mr-2 h-4 w-4' />
                  ) : (
                    <Folder className='mr-2 h-4 w-4' />
                  )}
                  <span>{result.name}</span>
                </div>
                <span className='text-xs text-muted-foreground'>
                  {result.path}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
