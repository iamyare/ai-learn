'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  File,
  Folder,
  Plus,
  Search,
  Sparkles,
  MenuIcon,
  XIcon
} from 'lucide-react'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'
import { getFoldersAndNotebooks } from '@/actions'
import { useMediaQuery } from './ui/use-media-query'

type FolderItem = {
  item_id: string
  item_name: string
  item_type: string
  parent_folder_id: string
  icon: string
  color: string
  subfolder_count: number
  notebook_count: number
  created_at: string
  updated_at: string
}

interface FolderTreeItemProps {
  item: FolderItem
  depth: number
  onExpand: (itemId: string) => Promise<FolderItem[]>
}

const FolderTreeItem: React.FC<FolderTreeItemProps> = ({
  item,
  depth,
  onExpand
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [children, setChildren] = useState<FolderItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const toggleExpand = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      if (item.item_type === 'folder') {
        setIsLoading(true)
        if (!isExpanded) {
          const result = await onExpand(item.item_id)
          setChildren(result)
        }
        setIsExpanded(!isExpanded)
        setIsLoading(false)
      }
    },
    [isExpanded, item, onExpand]
  )

  return (
    <div>
      <Button
        variant='ghost'
        className={cn(
          'w-full justify-start text-left font-normal',
          item.item_type === 'folder' && 'hover:bg-accent'
        )}
        onClick={item.item_type === 'folder' ? toggleExpand : undefined}
        disabled={isLoading}
      >
        <span
          style={{ marginLeft: `${depth * 12}px` }}
          className='flex items-center'
        >
          {item.item_type === 'folder' &&
            (isExpanded ? (
              <ChevronDown className='h-4 w-4 mr-2' />
            ) : (
              <ChevronRight className='h-4 w-4 mr-2' />
            ))}
          {item.item_type === 'folder' ? (
            <Folder className='h-4 w-4 mr-2' />
          ) : (
            <File className='h-4 w-4 mr-2' />
          )}
          {item.item_name}
        </span>
      </Button>
      {isExpanded && (
        <div>
          {children.length > 0 ? (
            children.map((child) => (
              <FolderTreeItem
                key={child.item_id}
                item={child}
                depth={depth + 1}
                onExpand={onExpand}
              />
            ))
          ) : (
            <p className='px-4 text-sm text-muted-foreground'>
              Esta carpeta está vacía
            </p>
          )}
        </div>
      )}
    </div>
  )
}

interface SidebarProps {
  children: React.ReactNode
  userId: string
  defaultOpen: boolean
}

export function Sidebar({ children, userId, defaultOpen }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [rootItems, setRootItems] = useState<FolderItem[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const isDesktop = useMediaQuery('(min-width: 600px)')

  useEffect(() => {
    const loadRootItems = async () => {
      const { folders, errorFolders } = await getFoldersAndNotebooks({
        userId,
        parentFolderId: undefined // For root items
      })
      if (folders && !errorFolders) {
        setRootItems(folders)
      }
    }
    loadRootItems()
  }, [userId])

  const handleExpand = useCallback(
    async (itemId: string) => {
      const { folders, errorFolders } = await getFoldersAndNotebooks({
        userId,
        parentFolderId: itemId
      })
      return folders && !errorFolders ? folders : []
    },
    [userId]
  )

  const toggleSidebar = () => {
    const newOpenState = !isOpen
    setIsOpen(newOpenState)
    document.cookie = `sidebarIsOpen=${newOpenState}`
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isOpen) {
        const threshold = 40 // pixels from the left edge
        setIsHovered(e.clientX <= threshold)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isOpen])

  if (!isDesktop) {
    return (
      <>
      <Disclosure as="nav" className="bg-background">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton>
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Button size={'icon'} variant={'ghost'}>
              <MenuIcon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
              <XIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
              </Button>
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <span className="text-2xl font-medium">Stick Note</span>
            </div>
          </div>
       
        </div>
      </div>

      <DisclosurePanel className="sm:hidden absolute w-full z-50 pb-2 backdrop-blur-sm bg-background/70 border-b">
      <div className='flex-grow overflow-auto'>
            {rootItems.map((item) => (
              <FolderTreeItem
                key={item.item_id}
                item={item}
                depth={0}
                onExpand={handleExpand}
              />
            ))}
          </div>
      </DisclosurePanel>
    </Disclosure>
    <main className={cn('flex-1 p-2', !isOpen && 'ml-2')}>

    {children}
    </main>
      </>
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
    <div className='flex h-full min-h-screen items-stretch'>
      <div
        ref={sidebarRef}
        className={cn(
          'transition-all duration-300 ease-in-out',
          isOpen ? 'w-[250px]' : isHovered ? 'w-[250px]' : 'w-0',
          !isOpen && 'absolute left-0 top-0 bottom-0'
        )}
        onMouseEnter={() => !isOpen && setIsHovered(true)}
        onMouseLeave={() => !isOpen && setIsHovered(false)}
      >
        <div
          className={cn(
            'flex flex-col relative py-2 px-4 border-r  transition-transform h-full bg-background/50 backdrop-blur-sm',
            !isOpen && isHovered && 'w-[250px] translate-x-0',
            !isOpen && !isHovered && ' -translate-x-52'
          )}
        >
          <Button
            className={cn(
              ' transition-all duration-300  ',
              !isOpen && 'hidden',
              isOpen && 'absolute top-0 right-0 '
            )}
            size={'icon'}
            onClick={toggleSidebar}
            variant={'ghost'}
          >
            {isOpen ? (
              <ChevronLeft className='h-4 w-4' />
            ) : (
              <ChevronRight className='h-4 w-4' />
            )}
          </Button>
          <span className=' text-2xl font-medium mb-4 mt-2'>
            Stick Note
          </span>

          <div className='flex-grow overflow-auto'>
            {rootItems.map((item) => (
              <FolderTreeItem
                key={item.item_id}
                item={item}
                depth={0}
                onExpand={handleExpand}
              />
            ))}
          </div>
        </div>

        <Button
          className={cn(
            ' transition-all duration-300  ',
            !isOpen &&
              'fixed left-0 top-0 bottom-0 rounded-none  h-full hover:bg-transparent -translate-x-2 ',
            !isOpen && isHovered && 'translate-x-0 ',
            isOpen && 'hidden '
          )}
          size={'icon'}
          onClick={toggleSidebar}
          variant={'ghost'}
        >
          {isOpen ? (
            <ChevronLeft className='h-4 w-4' />
          ) : (
            <ChevronRight className='h-4 w-4' />
          )}
        </Button>
      </div>

      <main className={cn('flex-1 p-5', !isOpen && 'ml-2')}>
        {children}
      </main>
    </div>
  </TooltipProvider>
  )
}
