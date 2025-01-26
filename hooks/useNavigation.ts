'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useFolderNavigationStore } from '@/stores/useFolderNavigationStore'
import { useCallback, useEffect } from 'react'

export const useNavigation = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { currentPath, username, setCurrentPath, setCurrentItemId } = useFolderNavigationStore()

  const navigateToFolder = useCallback((folderId: string, folderName: string) => {
    const newPath = currentPath.findIndex(item => item.id === folderId) !== -1
      ? currentPath.slice(0, currentPath.findIndex(item => item.id === folderId) + 1)
      : [...currentPath, { id: folderId, name: folderName }]

    setCurrentPath(newPath)
    setCurrentItemId(folderId)

    if (folderId === 'root') {
      router.push(`/${username}`)
    } else {
      const query = new URLSearchParams({
        folder_id: folderId,
        folder_name: folderName
      }).toString()
      router.push(`${pathname}?${query}`)
    }
  }, [currentPath, router, pathname, username, setCurrentPath, setCurrentItemId])

  return {
    navigateToFolder,
    currentPath
  }
}
