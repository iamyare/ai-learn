'use client'
import { Sidebar } from '@/components/sidebar'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useUserStore } from '@/stores/useUserStore'
import { useApiKeysStore } from '@/stores/useApiKeysStore'
import { useFolderNavigationStore } from '@/stores/useFolderNavigationStore'

export default function UsernameLayoutClient({
  apiKeys,
  children,
  user,
  defaultOpen,
  countPdf
}: {
  apiKeys: ApiKeys | null
  children: React.ReactNode
  user: UserAndSubscription
  defaultOpen: boolean
  countPdf: number | null
}) {
  const { username } = useParams()
  const { setUsername } = useFolderNavigationStore()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (username && typeof username === 'string') {
      setUsername(username)
    }
  }, [username]) // Removed setUsername from dependencies

  useEffect(() => {
    useUserStore.setState({ user, countPdf: countPdf ?? 5 })
    useApiKeysStore.setState({
      apiKeys: apiKeys ?? { gemini_key: null },
      userId: user.id
    })
    setIsLoaded(true)
  }, [user, countPdf, apiKeys])

  const params = useParams()

  if (params?.notebook) {
    return <div>{children}</div>
  }

  if (!isLoaded) {
    return null
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar userId={user.id}>{children}</Sidebar>
    </SidebarProvider>
  )
}
