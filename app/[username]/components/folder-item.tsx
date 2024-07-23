'use client'
import { deleteFolder } from '@/actions'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import { Separator } from '@/components/ui/separator'
import { Edit, Info, Trash } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface FolderItemProps {
  folder: GetFoldersAndNotebooksFunction
}

export default function FolderItem({ folder }: FolderItemProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleDelete = async () => {
    const { errorFolder } = await deleteFolder({ folderId: folder.item_id })
    if (!errorFolder) {
      router.push(pathname)
      router.refresh()
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <li>
          <Link
            className='flex flex-col items-center gap-2 p-4 rounded-lg justify-center text-lg text-center h-[200px] w-full transition-shadow duration-300 hover:ring-2 ring-offset-background hover:ring-offset-2 hover:shadow-black/[0.05] hover:shadow-xl animated-gradient '
            style={{
              background: folder.item_id
                ? `linear-gradient(45deg,${folder.color}20 0%, ${folder.color}60 100%)`
                : 'linear-gradient(45deg,hsla(var(--muted)/1) 0%, hsla(var(--muted-foreground)/0.5) 100%)',
              ['--tw-ring-color' as any]: folder.color
                ? `${folder.color}60`
                : 'hsla(var(--muted-foreground)/0.6)'
            }}
            href={`/username/${folder.item_id}`}
          >
            <span
              className='text-4xl'
              style={{
                color: folder.color ?? 'hsla(var(--primary)/1)'
              }}
            >
              {folder.icon}
            </span>
            <div className='flex flex-col'>
              <p
                className='font-medium'
                style={{
                  color: folder.color ?? 'hsla(var(--primary)/1)'
                }}
              >
                {folder.item_name}
              </p>
              <span className='text-sm text-muted-foreground'>4 elementos</span>
            </div>
          </Link>
        </li>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem>
          <Edit className='size-4 mr-2' />
          Editar nombre
        </ContextMenuItem>
        <ContextMenuItem>
          <Info className='size-4 mr-2' />
          Informacion
        </ContextMenuItem>
        <Separator className='my-1' />
        <ContextMenuItem
          className='!text-destructive hover:!bg-destructive/10 cursor-pointer'
          onClick={handleDelete}
        >
          <Trash className='size-4 mr-2' />
          Eliminar carpeta
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
