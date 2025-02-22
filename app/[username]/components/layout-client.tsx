'use client'
import { Sidebar } from '@/components/sidebar'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useUserStore } from '@/stores/useUserStore'
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
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar userId={user.id}>{children}</Sidebar>
    </SidebarProvider>
  )
}
