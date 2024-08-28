'use client'
import { useUser } from '@/context/useUserContext'
import { ViewProvider } from '@/context/useViewContext'
import { useFolderData } from './useFolderData'
import DashboardHeader from './dashboard-header'
import ItemList from './item-list'

export default function DashboardClient() {
  const { user } = useUser()

  const { folders, error: folderError, isLoading } = useFolderData(user!.id)

  if (folderError) {
    return <div>{folderError}</div>
  }
  if (!user) {
    return null
  }

  return (
    <main className='flex flex-col gap-8'>
      <DashboardHeader user={user} />
      <ViewProvider>
        <ItemList items={folders} isLoading={isLoading} />
      </ViewProvider>
    </main>
  )
}
