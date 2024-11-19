'use client'
import { Sidebar } from '@/components/sidebar'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FolderNavigationProvider } from '@/context/useFolderNavigationContext'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useUserStore } from '@/store/useUserStore'

export default function UsernameLayoutClient({
  children,
  user,
  defaultOpen
}: {
  children: React.ReactNode
  user: User
  defaultOpen: boolean
}) {
  useUserStore.setState({ user })
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
      <SidebarProvider defaultOpen={defaultOpen}>
        <Sidebar userId={user.id}>{children}</Sidebar>
      </SidebarProvider>
    </FolderNavigationProvider>
  )
}
