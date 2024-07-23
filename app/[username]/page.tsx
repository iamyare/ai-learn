'use client'
import { useEffect, useState } from 'react';
import DashboardHeader from './components/dashboard-header';
import FolderList from './components/folder-list';
import { getFoldersAndNotebooks } from '@/actions';
import { FolderNavigationProvider, useFolderNavigation } from '@/context/useFolderNavigationContext';

const DashboardContent = ({ username }: { username: string }) => {
  const { currentPath } = useFolderNavigation();
  const [folders, setFolders] = useState<GetFoldersAndNotebooksFunction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFolders = async () => {
      const currentFolderId = currentPath[currentPath.length - 1].id;
      const { folders, errorFolders } = await getFoldersAndNotebooks({
        userId: '346a2de6-85e2-4429-b4a4-e9fefd28a89c',
        parentFolderId: currentFolderId === 'root' ? undefined : currentFolderId
      });

      if (errorFolders) {
        setError('Error al cargar las carpetas');
      } else {
        setFolders(folders || []);
      }
    };

    fetchFolders();
  }, [currentPath]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className='flex flex-col gap-8'>
      <DashboardHeader />
      <FolderList folders={folders} />
    </main>
  );
};

export default function Dashboard({ params }: { params: { username: string } }) {
  return (
    <FolderNavigationProvider>
      <DashboardContent username={params.username} />
    </FolderNavigationProvider>
  );
}