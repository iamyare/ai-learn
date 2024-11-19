'use client'
import { useUserStore } from '@/store/useUserStore'
import { useFolderData } from './useFolderData'
import DashboardHeader from './dashboard-header'
import ItemList from './item-list'

export default function DashboardClient() {
  const user = useUserStore((state) => state.user)

  const {
    folders,
    error: folderError,
    isLoading
  } = useFolderData(user?.id ?? '')

  if (folderError) {
    return <div>{folderError}</div>
  }
  if (!user) {
    return null
  }

  return (
    <main className='flex flex-col gap-8'>
      <DashboardHeader user={user} />
      <ItemList items={folders} isLoading={isLoading} />
    </main>
  )
}
