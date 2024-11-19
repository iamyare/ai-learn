'use client'
import { Sidebar } from '@/components/sidebar'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FolderNavigationProvider } from '@/context/useFolderNavigationContext'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useUserStore } from '@/store/useUserStore'
import { useApiKeysStore } from '@/stores/useApiKeysStore'

export default function UsernameLayoutClient({
  apiKeys,
  children,
  user,
  defaultOpen
}: {
  apiKeys: ApiKeys | null
  children: React.ReactNode
  user: User
  defaultOpen: boolean
}) {
  useUserStore.setState({ user })
  const params = useParams()
  const [isLoaded, setIsLoaded] = useState(false)

  useApiKeysStore.setState({
    apiKeys: apiKeys ?? { gemini_key: null },
    userId: user.id
  })

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
