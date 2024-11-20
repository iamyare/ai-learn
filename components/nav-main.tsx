'use client'

import { Search, type LucideIcon } from 'lucide-react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { useUserStore } from '@/stores/useUserStore'
import SearchDialog from './search-dialog'
import { useEffect, useState } from 'react'

export function NavMain({
  items
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
  }[]
}) {
  const { user } = useUserStore()
  const [commandKey, setCommandKey] = useState('Ctrl')

  useEffect(() => {
    // Detect OS and set appropriate command key
    const isMac =
      typeof window !== 'undefined' &&
      /Mac|iPod|iPhone|iPad/.test(navigator.platform)
    setCommandKey(isMac ? '⌘' : 'Ctrl')
  }, [])

  if (!user) return null

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.isActive}>
            <Link href={`/${user.username}${item.url}`}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      <SidebarMenuItem>
        <SidebarMenuButton className='flex justify-between'>
          <div className='flex items-center gap-2'>
            <Search className='size-4' />
            <span>Buscar</span>
          </div>
          <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded  bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-70'>
            <span>{commandKey}</span>K
          </kbd>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SearchDialog />
    </SidebarMenu>
  )
}
