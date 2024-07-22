import { getFolders } from '@/actions'
import { Button } from '@/components/ui/button'
import { FilePlus2, Folder, FolderPlus } from 'lucide-react'
import Link from 'next/link'

export default async function Dashboard({
  params
}: {
  params: { username: string }
}) {
  const { folders, errorFolders } = await getFolders({
    userId: '346a2de6-85e2-4429-b4a4-e9fefd28a89c'
  })


  if (errorFolders) {
    return <div>Error loading folders</div>
  }

  return (
    <main className=' flex flex-col gap-8'>
      <header className='flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <h1 className=' text-2xl font-semibold'>Folder</h1>
          <span>hola</span>
        </div>
        <div className='flex gap-2 items-center'>
          <Button variant={'outline'}>
            <FolderPlus className=' size-4 mr-2' />
            <span>Carpeta</span>
          </Button>

          <Button variant={'outline'}>
            <FilePlus2 className=' size-4 mr-2' />
            <span>Notebook</span>
          </Button>
        </div>
      </header>
      <section>
        {folders ? (
          <ul className='grid grid-cols-3'>
            {folders.map((folder, index) => (
              <li key={folder.folder_id || index}>
                <Link className=' flex flex-col items-center gap-2 p-4 rounded-lg justify-center text-lg text-center h-[200px] aspect-[6/4] bg-muted transition-shadow duration-300 shadow-black/[0.01] hover:shadow-xl' 
                href={`/${params.username}/${folder.folder_id}`}>
                <Folder className=' size-8 text-primary' />
                  <div className='flex flex-col'>
                  <p className=' font-medium'>{folder.folder_name}</p>
                  <span className=' text-sm'>4 elementos</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No folders</p>
        )}
      </section>
    </main>
  )
}
