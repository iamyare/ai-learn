import { useQuery } from '@tanstack/react-query';
import { getFoldersAndNotebooks } from '@/actions';

export const useFoldersQuery = (userId: string, parentFolderId?: string) => {
  return useQuery({
    queryKey: ['folders', userId, parentFolderId],
    queryFn: async () => {
      const { folders, errorFolders } = await getFoldersAndNotebooks({
        userId,
        parentFolderId
      });

      if (errorFolders) {
        throw new Error(errorFolders.message || 'Error al cargar las carpetas');
      }

      return folders || [];
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
    retry: 2
  });
};
