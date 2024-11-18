'use client'
import * as React from 'react'
import {
  Bell,
  Check,
  Globe,
  Home,
  Keyboard,
  Link,
  Lock,
  Menu,
  MessageCircle,
  NotebookIcon,
  Paintbrush,
  Settings,
  Video
} from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider
} from '@/components/ui/sidebar'
import GeneralConfig from './forms/config/general'
import APIConfig from './forms/config/api-key'
import AudioConfig from './forms/config/audio-config'
import { ScrollArea } from '@/components/ui/scroll-area'
import UserSessions from './forms/config/sessions'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { useMediaQuery } from '../ui/use-media-query'
import NotebookConfig from './forms/config/notebook-config'

const data = {
  nav: [
    { name: 'Cuenta', icon: Home },
    { name: 'API', icon: Link },
    { name: 'Audio', icon: Video },
    { name: 'Notebook', icon: NotebookIcon }
    // { name: 'Sesiones', icon: MessageCircle },
    // { name: 'Eliminar cuenta', icon: Lock }
  ]
}

export function SettingsDialog({
  open,
  onOpenChange
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [activeTab, setActiveTab] = React.useState('Cuenta')
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const Content = (
    <>
      <DialogTitle className='sr-only'>Configuración</DialogTitle>
      <DialogDescription className='sr-only'>
        Personaliza tu configuración aquí.
      </DialogDescription>
      <SidebarProvider className='flex-col md:flex-row'>
        <Sidebar
          collapsible='none'
          className=' w-full md:w-[--sidebar-width] bg-transparent md:bg-sidebar  md:flex'
        >
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className=' flex-row md:flex-col'>
                  {data.nav.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        isActive={item.name === activeTab}
                        onClick={() => setActiveTab(item.name)}
                      >
                        <>
                          <item.icon />
                          <span>{item.name}</span>
                        </>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className='flex md:h-[480px] flex-1 flex-col overflow-hidden'>
          <header className='flex md:h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
            <div className=' items-center gap-2 px-4 hidden md:flex'>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className='hidden md:block cursor-pointer'>
                    <BreadcrumbLink onClick={() => setActiveTab('Cuenta')}>
                      Configuración
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className='hidden md:block' />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{activeTab}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <ScrollArea className='flex flex-1 flex-col gap-4'>
            {activeTab === 'Cuenta' && <GeneralConfig />}
            {activeTab === 'API' && <APIConfig />}
            {activeTab === 'Audio' && <AudioConfig />}
            {activeTab === 'Sesiones' && <UserSessions />}
            {activeTab === 'Notebook' && <NotebookConfig />}
            {activeTab === 'Eliminar cuenta' && (
              <div className='text-muted-foreground'>
                Luego se mostrará la opción de eliminar cuenta
              </div>
            )}
          </ScrollArea>
        </main>
      </SidebarProvider>
    </>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} modal>
        <DialogContent className='overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]'>
          {Content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className=' max-h-[90%] h-fit'>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Configuración</DrawerTitle>
          <DrawerDescription>
            Personaliza tu configuración aquí.
          </DrawerDescription>
        </DrawerHeader>
        {Content}
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant='outline'>Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
