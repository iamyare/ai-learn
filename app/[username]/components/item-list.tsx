'use client'
import React from 'react';
import { useFolderNavigation } from '@/context/useFolderNavigationContext';
import { Grid, List, Layout, AlignJustify, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Item from './item'; // Assuming the existing component is named 'item'
import { useView } from '@/context/useViewContext';
import { usePathname, useRouter } from 'next/navigation';

interface ViewButtonProps {
  icon: React.ElementType;
  viewType: ViewType;
  onClick: () => void;
  isActive: boolean;
}

const ViewButton: React.FC<ViewButtonProps> = ({ icon: Icon, onClick, isActive }) => (
  <Button
    onClick={onClick}
    variant={isActive ? 'default' : 'secondary'}
    size="icon"
  >
    <Icon className="size-4" />
  </Button>
);

interface ViewProps {
  items: GetFoldersAndNotebooksFunction[];
  onItemClick: (item: GetFoldersAndNotebooksFunction) => void;
}

const GridView: React.FC<ViewProps> = ({ items, onItemClick }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {items.map((item) => (
      <Item key={item.item_id} item={item} onClick={() => onItemClick(item)} />
    ))}
  </div>
);

const ListView: React.FC<ViewProps> = ({ items, onItemClick }) => (
  <div className="space-y-2">
    {items.map((item) => (
      <Item key={item.item_id} item={item} onClick={() => onItemClick(item)} />
    ))}
  </div>
);

const DetailView: React.FC<ViewProps> = ({ items, onItemClick }) => (
  <div className="space-y-4">
    {items.map((item) => (
      <div key={item.item_id} className="bg-secondary p-4 rounded-lg">
        <Item item={item} onClick={() => onItemClick(item)} />
        <p className="mt-2 text-sm text-muted-foreground">
          Created: {new Date(item.created_at).toLocaleDateString()} | Last accessed: {new Date(item.updated_at).toLocaleDateString()}
        </p>
      </div>
    ))}
  </div>
);

const VerticalGridView: React.FC<ViewProps> = ({ items, onItemClick }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {items.map((item) => (
      <div key={item.item_id} className="flex flex-col h-80">
        <Item item={item} onClick={() => onItemClick(item)} />
      </div>
    ))}
  </div>
);

const SquareGridView: React.FC<ViewProps> = ({ items, onItemClick }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {items.map((item) => (
      <div key={item.item_id} className="aspect-square">
        <Item item={item} onClick={() => onItemClick(item)} />
      </div>
    ))}
  </div>
);

interface ItemListProps {
  items: GetFoldersAndNotebooksFunction[];
}

const ItemList: React.FC<ItemListProps> = ({ items }) => {
  const { currentPath, navigateUp, navigateToFolder } = useFolderNavigation();
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
        <div>
          <Button onClick={navigateUp} disabled={currentPath.length === 1} variant="secondary">
            Go Back
          </Button>
          <span className="ml-4">
            Current location: {currentPath.map(item => item.name).join(' > ')}
          </span>
        </div>
        <div className="flex space-x-2">
          <ViewButton icon={Grid} viewType="grid" onClick={() => setView('grid')} isActive={currentView === 'grid'} />
          <ViewButton icon={List} viewType="list" onClick={() => setView('list')} isActive={currentView === 'list'} />
          <ViewButton icon={Layout} viewType="detail" onClick={() => setView('detail')} isActive={currentView === 'detail'} />
          <ViewButton icon={AlignJustify} viewType="verticalGrid" onClick={() => setView('verticalGrid')} isActive={currentView === 'verticalGrid'} />
          <ViewButton icon={Square} viewType="squareGrid" onClick={() => setView('squareGrid')} isActive={currentView === 'squareGrid'} />
        </div>
      </div>
      {renderView()}
    </section>
  );
};

export default ItemList;