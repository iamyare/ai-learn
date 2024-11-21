import { useQuery } from '@tanstack/react-query';
import { useFolderNavigationStore } from '@/stores/useFolderNavigationStore';
import { getFoldersAndNotebooks } from '@/actions';

export const useFolderData = (userId: string) => {
  const { currentPath } = useFolderNavigationStore();
  const currentFolderId = currentPath[currentPath.length - 1].id;

  return useQuery({
    queryKey: ['folders', userId, currentFolderId],
    queryFn: async () => {
      const { folders, errorFolders } = await getFoldersAndNotebooks({
        userId,
        parentFolderId: currentFolderId === 'root' ? undefined : currentFolderId
      });

      if (errorFolders) {
        throw new Error('Error al cargar las carpetas');
      }

      return folders || [];
    }
  });
};
