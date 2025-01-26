import { useFolderNavigationStore } from '@/stores/useFolderNavigationStore';
import { useFoldersQuery } from '@/hooks/useFoldersQuery';
import { useCallback } from 'react';

export const useFolderData = (userId: string) => {
  const { currentPath } = useFolderNavigationStore();
  const currentFolderId = currentPath[currentPath.length - 1]?.id;
  
  const {
    data: folders = [],
    error,
    isLoading,
    isError,
    refetch
  } = useFoldersQuery(userId, currentFolderId === 'root' ? undefined : currentFolderId);

  const memoizedData = {
    folders,
    error: isError ? error?.message || 'Error al cargar las carpetas' : null,
    isLoading,
    isEmpty: folders.length === 0,
    refetch: useCallback(() => refetch(), [refetch]),
    currentFolder: currentPath[currentPath.length - 1],
    hasItems: folders.length > 0
  };

  return memoizedData;
};
