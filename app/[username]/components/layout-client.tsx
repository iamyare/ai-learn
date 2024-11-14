'use client'
import { Sidebar } from '@/components/sidebar'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FolderNavigationProvider } from '@/context/useFolderNavigationContext'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function UsernameLayoutClient({
  children,
  userId,
  defaultOpen
}: {
  children: React.ReactNode
  userId: string
  defaultOpen: boolean
}) {
  const params = useParams()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (params?.notebook) {
    return <div>{children}</div>
  }

  if (!isLoaded) {
    return null // or a loading spinner
  }

  return (
    <FolderNavigationProvider>
      <SidebarProvider>
        <Sidebar defaultOpen={defaultOpen} userId={userId}>
          {children}
        </Sidebar>
      </SidebarProvider>
    </FolderNavigationProvider>
  )
}
