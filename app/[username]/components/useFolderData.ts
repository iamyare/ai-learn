import { useState, useEffect } from 'react';
import { useFolderNavigationStore } from '@/stores/useFolderNavigationStore';
import { getFoldersAndNotebooks } from '@/actions';

export const useFolderData = (userId: string) => {
  const [folders, setFolders] = useState<GetFoldersAndNotebooksFunction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentPath } = useFolderNavigationStore();

  useEffect(() => {
    const fetchFolders = async () => {
      setIsLoading(true);
      const currentFolderId = currentPath[currentPath.length - 1].id;
      const { folders, errorFolders } = await getFoldersAndNotebooks({
        userId,
        parentFolderId: currentFolderId === 'root' ? undefined : currentFolderId
      });

      if (errorFolders) {
        setError('Error al cargar las carpetas');
      } else {
        setFolders(folders || []);
      }
      setIsLoading(false);
    };

    fetchFolders();
  }, [currentPath, userId]);

  return { folders, error, isLoading };
};
