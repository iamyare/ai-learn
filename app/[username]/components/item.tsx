import React from 'react';
import { Folder, FileText } from 'lucide-react';

interface ItemProps {
  item: GetFoldersAndNotebooksFunction
  onClick: () => void;
}

const Item: React.FC<ItemProps> = ({ item, onClick }) => {
  if (item.item_type === 'folder') {
    return (
      <div 
        className="flex flex-col items-center justify-center h-40 p-4 hover:ring-2 ring-offset-2 ring-offset-background rounded-lg transition-shadow duration-300 hover:shadow-lg cursor-pointer"
        style={{
          background: item.color ? `linear-gradient(45deg, ${item.color}20 0%, ${item.color}60 100%)` : `linear-gradient(45deg, hsla(var(--muted-foreground)/0.2) 0%, hsla(var(--muted-foreground)/0.5) 100%)`,
          ['--tw-ring-color' as any]: item.color ? `${item.color}60` : 'hsla(var(--muted-foreground)/0.6)',

        }}
        onClick={onClick}
      >
        <span className="text-4xl mb-2" style={{ color: item.color }}>
          {item.icon || <Folder />}
        </span>
        <p className="font-medium text-center" style={{ color: item.color }}>
          {item.item_name}
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1">
          {item.subfolder_count > 0 && `${item.subfolder_count} Folders`}
          {item.subfolder_count > 0 && item.notebook_count > 0 && ' • '}
          {item.notebook_count > 0 && `${item.notebook_count} Notebooks`}
        </p>
      </div>
    );
  } else {
    return (
      <div 
        className="flex flex-col h-full p-4 rounded-lg hover:ring-2 ring-offset-2 ring-offset-background   transition-shadow duration-300 hover:shadow-lg cursor-pointer  border border-muted"
        style={{
          ['--tw-ring-color' as any]: item.color ? `${item.color}60` : 'hsla(var(--primary)/0.6)'
        }}
        onClick={onClick}
      >
        <div className="flex items-center mb-2">
          <FileText className="text-primary mr-2" />
          <p className="font-medium text-primary">{item.item_name}</p>
        </div>
      </div>
    );
  }
};

export default Item;