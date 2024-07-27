import React from 'react';
import { useFolderNavigation } from '@/context/useFolderNavigationContext';
import { useView } from '@/context/useViewContext';
import { usePathname, useRouter } from 'next/navigation';
import GridView from './views/grid-view';
import ListView from './views/list-view';
import DetailView from './views/detail-view';
import VerticalGridView from './views/vertical-grid-view';
import SquareGridView from './views/square-grid-view';
import RenderBreadcrumb from './breadcrumb';
import ViewButtons from './view-buttons';


interface ItemListProps {
  items: GetFoldersAndNotebooksFunction[];
}

const ItemList: React.FC<ItemListProps> = ({ items }) => {
  const { currentPath, navigateToFolder } = useFolderNavigation();
  const { currentView, setView } = useView();
  const pathname = usePathname();
  const router = useRouter();

  const handleItemClick = (item: GetFoldersAndNotebooksFunction) => {
    if (item.item_type === 'folder') {
      navigateToFolder(item.item_id, item.item_name);
    } else {

      router.push(`${pathname}/${item.item_id}`);
    }
  };

  const renderView = () => {
    const viewProps = { items, onItemClick: handleItemClick };
    switch (currentView) {
      case 'grid':
        return <GridView {...viewProps} />;
      case 'list':
        return <ListView {...viewProps} />;
      case 'detail':
        return <DetailView {...viewProps} />;
      case 'verticalGrid':
        return <VerticalGridView {...viewProps} />;
      case 'squareGrid':
        return <SquareGridView {...viewProps} />;
      default:
        return <GridView {...viewProps} />;
    }
  };

  return (
    <section>
      <div className="mb-4 flex justify-between items-center">
        <RenderBreadcrumb currentPath={currentPath} navigateToFolder={navigateToFolder} />
        <ViewButtons currentView={currentView} setView={setView} />
      </div>
      {renderView()}
    </section>
  );
};

export default ItemList;