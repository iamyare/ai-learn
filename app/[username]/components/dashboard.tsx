'use client'
import { useUserStore } from '@/stores/useUserStore'
import { useFolderData } from './useFolderData'
import DashboardHeader from './dashboard-header'
import ItemList from './item-list'

export default function DashboardClient() {
  const user = useUserStore((state) => state.user)
  const { data: folders, isError, isLoading } = useFolderData(user?.id ?? '')

  if (isError) {
    return <div>Error al cargar las carpetas</div>
  }

  if (!user) {
    return null
  }

  return (
    <main className='flex flex-col gap-8'>
      <DashboardHeader user={user} />
      <ItemList items={folders || []} isLoading={isLoading} />
    </main>
  )
}
