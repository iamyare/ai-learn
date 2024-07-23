'use client'
import FolderItem from './folder-item'

export default function FolderList({ folders }: { folders: Folder[] }) {

  return (
    <section>
      <ul className='grid grid-cols-3 gap-4'>

        {folders.map((folder, index) => (
          <FolderItem
            key={folder.folder_id || index}
            folder={folder}
          />
        ))}

      </ul>
    </section>
  )
}
