'use client'

import {
  AlertCircle,
  Archive,
  ArchiveX,
  FileIcon,
  Inbox,
  MessagesSquare,
  Plus,
  Search,
  Send,
  ShoppingCart,
  Sparkles,
  Trash2,
  Users2
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from './ui/resizable'
import { useState, useEffect } from 'react'
import { Nav } from './nav'
import { Button } from './ui/button'

interface SidebarProps {
  defaultLayout?: number
  defaultCollapsed?: boolean
  navCollapsedSize?: number
  children: React.ReactNode
}

export function Sidebar({
  defaultLayout = 20,
  defaultCollapsed = false,
  navCollapsedSize = 4,
  children
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed)

  useEffect(() => {
    const savedCollapsed = localStorage.getItem('react-resizable-panels:collapsed')
    if (savedCollapsed !== null) {
      setIsCollapsed(savedCollapsed === 'true')
    }
  }, [])

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction='horizontal'
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`
        }}
        className='h-full min-h-screen items-stretch'
      >
        <ResizablePanel
          defaultSize={defaultLayout}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={10}
          maxSize={25}
          onCollapse={() => {
            setIsCollapsed(true)
            localStorage.setItem('react-resizable-panels:collapsed', 'true')
          }}
          onExpand={() => {
            setIsCollapsed(false)
            localStorage.setItem('react-resizable-panels:collapsed', 'false')
          }}
          className={cn(
            isCollapsed &&
              'min-w-[50px]  transition-all duration-300 ease-in-out'
          )}
        >
          <div
            className={cn(
              'flex h-[52px] items-center justify-center',
              isCollapsed ? 'h-[52px] ' : 'px-2'
            )}
          >
            {/* <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} /> */}
          </div>
          {/* <Separator /> */}

          <div className='flex gap-1 px-2 my-4 '>
            <Button
                size={
                    isCollapsed ? 'default' : 'icon'
                }
              className={cn('w-full',
                isCollapsed && 'p-1'
              )}
            >
              <Plus className='size-4' />
              {isCollapsed ? null : (
                <span className='ml-2'>Crear Notebook</span>
              )}
            </Button>
            {!isCollapsed && (
              <>
                <Button
                  size={'icon'}
                  variant={'outline'}
                  className=' aspect-square'
                >
                  <Search className='size-4' />
                </Button>
                <Button
                  size={'icon'}
                  variant={'outline'}
                  className=' aspect-square'
                >
                  <Sparkles className='size-4' />
                </Button>
              </>
            )}
          </div>

          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: 'Inbox',
                label: '128',
                icon: Inbox,
                variant: 'default'
              },
              {
                title: 'Drafts',
                label: '9',
                icon: FileIcon,
                variant: 'ghost'
              },
              {
                title: 'Sent',
                label: '',
                icon: Send,
                variant: 'ghost'
              },
              {
                title: 'Junk',
                label: '23',
                icon: ArchiveX,
                variant: 'ghost'
              },
              {
                title: 'Trash',
                label: '',
                icon: Trash2,
                variant: 'ghost'
              },
              {
                title: 'Archive',
                label: '',
                icon: Archive,
                variant: 'ghost'
              }
            ]}
          />
          {/* <Separator /> */}
          <hr />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: 'Social',
                label: '972',
                icon: Users2,
                variant: 'ghost'
              },
              {
                title: 'Updates',
                label: '342',
                icon: AlertCircle,
                variant: 'ghost'
              },
              {
                title: 'Forums',
                label: '128',
                icon: MessagesSquare,
                variant: 'ghost'
              },
              {
                title: 'Shopping',
                label: '8',
                icon: ShoppingCart,
                variant: 'ghost'
              },
              {
                title: 'Promotions',
                label: '21',
                icon: Archive,
                variant: 'ghost'
              }
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80}>
            <main className=' p-5'>
            {children}
            </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
