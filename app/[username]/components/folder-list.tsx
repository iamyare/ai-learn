'use client'
import FolderItem from './folder-item'

export default function FolderList({ folders }: { folders: GetFoldersAndNotebooksFunction[] }) {

  return (
    <section>
      <ul className='grid grid-cols-3 gap-4'>

        {folders.map((folder, index) => (
          <FolderItem
            key={folder.item_id || index}
            folder={folder}
          />
        ))}

      </ul>
    </section>
  )
}
