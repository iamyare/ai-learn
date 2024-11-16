import * as React from 'react'
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
import { Home, Link, Video, MessageCircle, Lock } from 'lucide-react'

const data = {
  nav: [
    { name: 'Cuenta', icon: Home },
    { name: 'API', icon: Link },
    { name: 'Audio', icon: Video },
    { name: 'Sesiones', icon: MessageCircle },
    { name: 'Eliminar cuenta', icon: Lock }
  ]
}

export default function SettingsSidebar({
  activeTab,
  setActiveTab
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
}) {
  return (
    <SidebarProvider className='items-start'>
      <Sidebar collapsible='none' className='hidden md:flex'>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
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
    </SidebarProvider>
  )
}
