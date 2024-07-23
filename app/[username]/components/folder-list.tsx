'use client'
import { useFolderNavigation } from '@/context/useFolderNavigationContext';
import FolderItem from './folder-item';

export default function FolderList({ folders }: { folders: GetFoldersAndNotebooksFunction[] }) {
  const { currentPath, navigateUp } = useFolderNavigation();

  return (
    <section>
      <div className="mb-4">
        <button onClick={navigateUp} disabled={currentPath.length === 1}>
          Volver atrás
        </button>
        <span className="ml-4">
          Ubicación actual: {currentPath.map(folder => folder.name).join(' > ')}
        </span>
      </div>
      <ul className='grid grid-cols-3 gap-4'>
        {folders.map((folder, index) => (
          <FolderItem
            key={folder.item_id || index}
            folder={folder}
          />
        ))}
      </ul>
    </section>
  );
}