'use client'
import { useFolderNavigation } from '@/context/useFolderNavigationContext';
import { useEffect, useState } from 'react';
import { getFoldersAndNotebooks } from '@/actions';
import DashboardHeader from './dashboard-header';
import ItemList from './item-list';
import { useUser } from '@/context/useUserContext';
import { ItemListSkeleton } from '@/components/skeletons';
import { ViewProvider } from '@/context/useViewContext';


const useFolderData = (userId: string) => {
  const [folders, setFolders] = useState<GetFoldersAndNotebooksFunction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentPath } = useFolderNavigation();

  useEffect(() => {
    const fetchFolders = async () => {
      setIsLoading(true);
      //simular tardanza en la respuesta
        // await new Promise(resolve => setTimeout(resolve, 5000));
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

export default function DashboardClient() {
  const { user } = useUser();
  const { folders, error: folderError, isLoading } = useFolderData(user!.id);

  if (folderError) {
    return <div>{folderError}</div>;
  }

  return (
    <main className='flex flex-col gap-8'>
      <DashboardHeader />
      <ViewProvider>
      {isLoading ? (
        <ItemListSkeleton />
      ) : (
        <ItemList items={folders} />
      )}
      </ViewProvider>
    </main>
  );
}