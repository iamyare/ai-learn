import React from 'react'
import { useFolderNavigation } from '@/context/useFolderNavigationContext'
import { useView } from '@/context/useViewContext'
import { usePathname, useRouter } from 'next/navigation'
import GridView from './views/grid-view'
import ListView from './views/list-view'
import DetailView from './views/detail-view'
import VerticalGridView from './views/vertical-grid-view'
import SquareGridView from './views/square-grid-view'
import RenderBreadcrumb from './breadcrumb'
import ViewButtons from './view-buttons'
import { ItemListSkeleton } from '@/components/skeletons'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import { Separator } from '@/components/ui/separator'

interface ItemListProps {
  items: GetFoldersAndNotebooksFunction[]
  isLoading: boolean
}

const ItemList: React.FC<ItemListProps> = ({ items, isLoading }) => {
  const { currentPath, navigateToFolder } = useFolderNavigation()
  const { currentView, setView } = useView()
  const pathname = usePathname()
  const router = useRouter()

  const handleItemClick = (item: GetFoldersAndNotebooksFunction) => {
    if (item.item_type === 'folder') {
      navigateToFolder(item.item_id, item.item_name)
    } else {
      router.push(`${pathname}/${item.item_id}`)
    }
  }

  const renderView = () => {
    const viewProps = { items, onItemClick: handleItemClick }
    switch (currentView) {
      case 'grid':
        return <GridView {...viewProps} />
      case 'list':
        return <ListView {...viewProps} />
      case 'detail':
        return <DetailView {...viewProps} />
      case 'verticalGrid':
        return <VerticalGridView {...viewProps} />
      case 'squareGrid':
        return <SquareGridView {...viewProps} />
      default:
        return <GridView {...viewProps} />
    }
  }

  return (
    <section>
      <div className='mb-4 flex justify-between items-center'>
        <RenderBreadcrumb
          currentPath={currentPath}
          navigateToFolder={navigateToFolder}
        />
        <ViewButtons currentView={currentView} setView={setView} />
      </div>
      {isLoading ? (
        <ItemListSkeleton />
      ) : (
        items.length > 0 ? (renderView()):(
          <div className='flex flex-col items-center text-center justify-center h-64 text-muted-foreground'>
            <h4 className=' text-lg'>No hay elementos en esta carpeta</h4>
            <p className=' text-sm'>
              Considere crear una nueva carpeta o un nuevo notebook.
            </p>
          </div>
        )
      )}
    </section>
  )
}

export default ItemList
