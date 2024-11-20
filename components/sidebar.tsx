/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Home, Search, ChevronLeft, StarIcon } from 'lucide-react'
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarRail
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { getFoldersAndNotebooks } from '@/actions'
import { useMediaQuery } from './ui/use-media-query'
import { Tree, Folder, File, TreeViewElement } from '@/components/file-tree'
import { usePathname } from 'next/navigation'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import Link from 'next/link'
import { NavMain } from './nav-main'

interface SidebarProps {
  children: React.ReactNode
  userId: string
}

const mainNavItems = [
  {
    title: 'Inicio',
    url: '/',
    icon: Home,
    isActive: true
  },
  {
    title: 'Favoritos',
    url: '?favorites',
    icon: StarIcon
  }
  // {
  //   title: 'Buscar',
  //   url: '/search',
  //   icon: Search
  // }
]

export function Sidebar({ children, userId }: SidebarProps) {
  const [rootItems, setRootItems] = useState<TreeViewElement[]>([])
  const pathname = usePathname()
  const isDesktop = useMediaQuery('(min-width: 600px)')

  const loadItems = useCallback(
    async (parentFolderId?: string) => {
      const { folders, errorFolders } = await getFoldersAndNotebooks({
        userId,
        parentFolderId
      })
      if (folders && !errorFolders) {
        return folders.map(
          (item): TreeViewElement => ({
            id: item.item_id,
            name: item.item_name,
            icon: item.icon,
            isSelectable: true,
            type: item.item_type as 'folder' | 'file',
            path:
              item.item_type === 'notebook'
                ? `${pathname}/${item.item_id}`
                : undefined
          })
        )
      }
      return []
    },
    [pathname, userId]
  )

  useEffect(() => {
    loadItems().then(setRootItems)
  }, [loadItems])

  if (!isDesktop) {
    return (
      <div className='flex flex-col h-screen w-screen min-h-screen'>
        <ScrollArea className=' h-full w-full'>
          <section className=' p-4'>{children}</section>
          <ScrollBar />
        </ScrollArea>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className='flex h-screen w-screen min-h-screen'>
        <SidebarComponent collapsible='icon'>
          <SidebarHeader className=' p-2'>
            <Link
              href='/'
              className='flex items-center group-data-[collapsible=icon]:justify-center gap-2'
            >
              <img
                src='/icon-256x256.png'
                className=' h-8 object-cover group-data-[collapsible=icon]:h-7'
                alt=''
              />
              <span className=' text-lg text-primary sout-gummy text-nowrap group-data-[collapsible=icon]:hidden animate-fade-in'>
                Stick Note
              </span>
            </Link>
            <NavMain items={mainNavItems} />
          </SidebarHeader>
          <SidebarContent>
            <Tree
              onFolderExpand={loadItems}
              className=' mt-4'
              elements={rootItems}
            >
              {rootItems.map((item) =>
                item.type === 'folder' ? (
                  <Folder
                    icon={item.icon}
                    key={item.id}
                    element={item.name}
                    value={item.id}
                  />
                ) : (
                  <File key={item.id} value={item.id} path={item.path}>
                    {item.name}
                  </File>
                )
              )}
            </Tree>
          </SidebarContent>
          <SidebarRail>
            <Button
              size='icon'
              variant='outline'
              className=' mt-5 -ml-2 p-2 h-fit z-50 aspect-square rounded-full group-data-[collapsible=icon]:rotate-180 transition-transform duration-500'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
          </SidebarRail>
        </SidebarComponent>

        <SidebarInset>
          <ScrollArea className=' h-full w-full'>
            <section className=' p-4'>{children}</section>
            <ScrollBar />
          </ScrollArea>
        </SidebarInset>
      </div>
    </TooltipProvider>
  )
}
