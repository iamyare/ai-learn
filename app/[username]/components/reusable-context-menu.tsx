import React, { useTransition  } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Separator } from '@/components/ui/separator';
import { deleteFolder, deleteNotebook } from '@/actions';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface ContextMenuProps {
  children: React.ReactNode;
  item: GetFoldersAndNotebooksFunction;
}

const ReusableContextMenu: React.FC<ContextMenuProps> = ({
  children,
  item,
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleEdit() {
    console.log(`Editing ${item.item_type}: ${item.item_name}`);
  }

  function handleDelete(){
    console.log(`Deleting ${item.item_type}: ${item.item_name}`);
    startTransition(async () => {
      const { error } = item.item_type === 'folder'
        ? await deleteFolder({ folderId: item.item_id })
        : await deleteNotebook({ notebookId: item.item_id });

      if (error) {
        toast({
          title: 'Error',
          description: `No se pudo eliminar ${item.item_type === 'folder' ? 'la carpeta' : 'el notebook'}`,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Éxito',
        description: `${item.item_type === 'folder' ? 'Carpeta' : 'Notebook'} eliminado correctamente`,
        variant: 'default',
      });

      // Actualizar la lista de carpetas y notebooks
      router.refresh();
    });
  }

  function handleViewProperties(){
    console.log(`Viewing properties of ${item.item_type}: ${item.item_name}`);
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className={cn(isPending ? 'loading-card': 'w-full h-full')}>
          {children}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleEdit}>
          Editar {item.item_type === 'folder' ? 'carpeta' : 'notebook'}
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDelete}>
          Eliminar {item.item_type === 'folder' ? 'carpeta' : 'notebook'}
        </ContextMenuItem>
        <Separator className='my-1' />
        <ContextMenuItem onClick={handleViewProperties}>
          Propiedades
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ReusableContextMenu;