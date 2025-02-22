'use client'
import React, { useTransition, useCallback } from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import { Separator } from '@/components/ui/separator'
import { deleteFolder, deleteNotebook } from '@/actions'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { usePathname, useRouter } from 'next/navigation'
import { useFolderNavigationStore } from '@/stores/useFolderNavigationStore'
import { Info, Pencil, Trash } from 'lucide-react'

interface ContextMenuProps {
  children: React.ReactNode
  item: GetFoldersAndNotebooksFunction
}

const ReusableContextMenu: React.FC<ContextMenuProps> = ({
  children,
  item
}) => {
  const [isPending, startTransition] = useTransition()
  const { currentPath, navigateToFolder } = useFolderNavigationStore()

  const handleEdit = useCallback(() => {
    console.log(`Editing ${item.item_type}: ${item.item_name}`)
    // Implementar lógica de edición aquí
  }, [item])

  const handleDelete = () => {
    console.log(`Deleting ${item.item_type}: ${item.item_name}`)
    startTransition(async () => {
      const { error } =
        item.item_type === 'folder'
          ? await deleteFolder({ folderId: item.item_id })
          : await deleteNotebook({ notebookId: item.item_id })

      if (error) {
        toast({
          title: 'Error',
          description: `No se pudo eliminar ${
            item.item_type === 'folder' ? 'la carpeta' : 'el notebook'
          }`,
          variant: 'destructive'
        })
        return
      }

      toast({
        title: 'Éxito',
        description: `${
          item.item_type === 'folder' ? 'Carpeta' : 'Notebook'
        } eliminado correctamente`,
        variant: 'default'
      })

      navigateToFolder(
        currentPath[currentPath.length - 1].id,
        currentPath[currentPath.length - 1].name
      )
    })
  }

  const handleViewProperties = useCallback(() => {
    console.log(`Viewing properties of ${item.item_type}: ${item.item_name}`)
    // Implementar lógica para ver propiedades aquí
  }, [item])

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            isPending ? 'opacity-50 pointer-events-none' : '',
            'w-full h-full'
          )}
        >
          {children}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleEdit}>
          <Pencil className='mr-1 size-3.5' />
          Editar {item.item_type === 'folder' ? 'carpeta' : 'notebook'}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={handleDelete}
          className=' hover:!text-destructive hover:!bg-destructive/10'
        >
          <Trash className='mr-1 size-3.5' />
          Eliminar {item.item_type === 'folder' ? 'carpeta' : 'notebook'}
        </ContextMenuItem>
        <Separator className='my-1' />
        <ContextMenuItem onClick={handleViewProperties}>
          <Info className='mr-1 size-3.5' />
          Propiedades
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default ReusableContextMenu
