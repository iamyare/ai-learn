import React, { useEffect } from 'react'
import { useFolderNavigation } from '@/context/useFolderNavigationContext'
import { useView } from '@/context/useViewContext'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import GridView from './views/grid-view'
import ListView from './views/list-view'
import DetailView from './views/detail-view'
import VerticalGridView from './views/vertical-grid-view'
import SquareGridView from './views/square-grid-view'
import RenderBreadcrumb from './breadcrumb'
import ViewButtons from './view-buttons'
import { ItemListSkeleton } from '@/components/skeletons'
import { useTransitionRouter } from 'next-view-transitions'

interface ItemListProps {
  items: GetFoldersAndNotebooksFunction[]
  isLoading: boolean
}

function slideInOut(direction: 'forward' | 'backward') {
  const oldTransform = direction === 'forward' ? 'translate(-100px, 0)' : 'translate(100px, 0)'
  const newTransform = direction === 'forward' ? 'translate(100px, 0)' : 'translate(-100px, 0)'

  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: 'translate(0, 0)',
      },
      {
        opacity: 0,
        transform: oldTransform,
      },
    ],
    {
      duration: 400,
      easing: 'ease',
      fill: 'forwards',
      pseudoElement: '::view-transition-old(root)',
    }
  )

  document.documentElement.animate(
    [
      {
        opacity: 0,
        transform: newTransform,
      },
      {
        opacity: 1,
        transform: 'translate(0, 0)',
      },
    ],
    {
      duration: 400,
      easing: 'ease',
      fill: 'forwards',
      pseudoElement: '::view-transition-new(root)',
    }
  )
}

const ItemList: React.FC<ItemListProps> = ({ items, isLoading }) => {
  const { currentPath, navigateToFolder } = useFolderNavigation()
  const { currentView, setView } = useView()
  const pathname = usePathname()
  const router = useRouter()
  const routerTransition = useTransitionRouter()
  const params = useSearchParams()

  useEffect(() => {
    //cargar la lista de items por los parametros de la URL
    navigateToFolder(
      params.get('folder_id') ?? 'root',
      params.get('folder_name') ?? 'root'
    )
  }, [navigateToFolder, params])

  const handleItemClick = (item: GetFoldersAndNotebooksFunction) => {
    if (item.item_type === 'folder') {
      // Construir la nueva URL con los params sin recargar la página
      const newParams = new URLSearchParams(params)
      newParams.set('folder_id', item.item_id)
      newParams.set('folder_name', item.item_name)
      const newPath = `${pathname}?${newParams.toString()}`
      router.replace(newPath)
    } else {
      //
      routerTransition.push(`${pathname}/${item.item_id}`, {
        onTransitionReady: () => slideInOut('forward'),
      })
    }
  }

  const handleBackClick = () => {
    router.back()
    slideInOut('backward')
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
        items.length > 0 ? (
          renderView()
        ) : (
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