'use client'
import { useEffect, useState } from 'react'
import { getFoldersAndNotebooks } from '@/actions'
import { useFolderNavigation } from '@/context/useFolderNavigationContext'
import DashboardHeader from './dashboard-header'
import ItemList from './item-list'

const useFolderData = (user: User) => {
  const [folders, setFolders] = useState<GetFoldersAndNotebooksFunction[]>([])
  const [error, setError] = useState<string | null>(null)
  const { currentPath } = useFolderNavigation()

  useEffect(() => {
    const fetchFolders = async () => {
      const currentFolderId = currentPath[currentPath.length - 1].id
      const { folders, errorFolders } = await getFoldersAndNotebooks({
        userId: user.id,
        parentFolderId: currentFolderId === 'root' ? undefined : currentFolderId
      })

      if (errorFolders) {
        setError('Error al cargar las carpetas')
      } else {
        setFolders(folders || [])
      }
    }

    fetchFolders()
  }, [currentPath, user.id])

  return { folders, error }
}

export default function DashboardClient({ user }: { user: User }) {
  const { folders, error: folderError } = useFolderData(user)

  if (folderError) {
    return <div>{folderError}</div>
  }

  return (
    <main className='flex flex-col gap-8'>
      <DashboardHeader />
      <ItemList folders={folders} />
    </main>
  )
}