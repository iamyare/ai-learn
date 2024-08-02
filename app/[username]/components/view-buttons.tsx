import React from 'react';
import { Grid, List, Layout, AlignJustify, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface ViewButtonsProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const ViewButtons: React.FC<ViewButtonsProps> = ({ currentView, setView }) => (
  <div className="flex space-x-2">
    <ViewButton icon={Grid} viewType="grid" onClick={() => setView('grid')} isActive={currentView === 'grid'} />
    <ViewButton icon={List} viewType="list" onClick={() => setView('list')} isActive={currentView === 'list'} />
    <ViewButton icon={Layout} viewType="detail" onClick={() => setView('detail')} isActive={currentView === 'detail'} />
    <ViewButton icon={AlignJustify} viewType="verticalGrid" onClick={() => setView('verticalGrid')} isActive={currentView === 'verticalGrid'} />
    <ViewButton icon={Square} viewType="squareGrid" onClick={() => setView('squareGrid')} isActive={currentView === 'squareGrid'} />
  </div>
);

export default ViewButtons;
