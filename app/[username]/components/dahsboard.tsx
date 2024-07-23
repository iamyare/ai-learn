
// app/[username]/components/dashboard.tsx
'use client'
import { useFolderNavigation } from '@/context/useFolderNavigationContext';
import { useEffect, useState } from 'react';
import { getFoldersAndNotebooks } from '@/actions';
import DashboardHeader from './dashboard-header';
import ItemList from './item-list';
import { useUser } from '@/context/useUserContext';

const useFolderData = (userId: string) => {
  const [folders, setFolders] = useState<GetFoldersAndNotebooksFunction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { currentPath } = useFolderNavigation();

  useEffect(() => {
    const fetchFolders = async () => {
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
    };

    fetchFolders();
  }, [currentPath, userId]);

  return { folders, error };
};

export default function DashboardClient() {
  const { user } = useUser();
  const { folders, error: folderError } = useFolderData(user!.id);

  if (folderError) {
    return <div>{folderError}</div>;
  }

  return (
    <main className='flex flex-col gap-8'>
      <DashboardHeader />
      <ItemList folders={folders} />
    </main>
  );
}