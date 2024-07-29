'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronLeft, ChevronDown, File, Folder, Plus, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getFoldersAndNotebooks } from '@/actions';

type FolderItem = {
  item_id: string;
  item_name: string;
  item_type: string;
  parent_folder_id: string;
  icon: string;
  color: string;
  subfolder_count: number;
  notebook_count: number;
  created_at: string;
  updated_at: string;
};

interface FolderTreeItemProps {
  item: FolderItem;
  depth: number;
  onExpand: (itemId: string) => Promise<FolderItem[]>;
}

const FolderTreeItem: React.FC<FolderTreeItemProps> = ({ item, depth, onExpand }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [children, setChildren] = useState<FolderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleExpand = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.item_type === 'folder') {
      setIsLoading(true);
      if (!isExpanded) {
        const result = await onExpand(item.item_id);
        setChildren(result);
      }
      setIsExpanded(!isExpanded);
      setIsLoading(false);
    }
  }, [isExpanded, item, onExpand]);

  return (
    <div>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start text-left font-normal",
          item.item_type === 'folder' && "hover:bg-accent"
        )}
        onClick={item.item_type === 'folder' ? toggleExpand : undefined}
        disabled={isLoading}
      >
        <span style={{ marginLeft: `${depth * 12}px` }} className="flex items-center">
          {item.item_type === 'folder' && (
            isExpanded ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />
          )}
          {item.item_type === 'folder' ? <Folder className="h-4 w-4 mr-2" /> : <File className="h-4 w-4 mr-2" />}
          {item.item_name}
        </span>
      </Button>
      {isExpanded && (
        <div>
          {children.length > 0 ? (
            children.map(child => (
              <FolderTreeItem key={child.item_id} item={child} depth={depth + 1} onExpand={onExpand} />
            ))
          ) : (
            <p className='px-4 text-sm text-muted-foreground'>Esta carpeta está vacía</p>
          )}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  children: React.ReactNode;
  userId: string;
  defaultOpen: boolean;
}

export function Sidebar({ children, userId, defaultOpen }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [rootItems, setRootItems] = useState<FolderItem[]>([]);

  useEffect(() => {
    const loadRootItems = async () => {
      const { folders, errorFolders } = await getFoldersAndNotebooks({
        userId,
        parentFolderId: undefined // For root items
      });
      if (folders && !errorFolders) {
        setRootItems(folders);
      }
    };
    loadRootItems();
  }, [userId]);

  const handleExpand = useCallback(async (itemId: string) => {
    const { folders, errorFolders } = await getFoldersAndNotebooks({
      userId,
      parentFolderId: itemId
    });
    return folders && !errorFolders ? folders : [];
  }, [userId]);

  const toggleSidebar = () => {
    const newOpenState = !isOpen;
    setIsOpen(newOpenState);
    document.cookie = `sidebarIsOpen=${newOpenState}`;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full min-h-screen items-stretch">
        <div
          className={cn(
            "transition-all duration-300 ease-in-out",
            isOpen ? "w-[250px]" : "w-[50px]"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex gap-1 px-2 my-4">
              <Button size={isOpen ? 'default' : 'icon'} className={cn('w-full', !isOpen && 'p-1')}>
                <Plus className="size-4" />
                {isOpen && <span className="ml-2">Crear Notebook</span>}
              </Button>
              {isOpen && (
                <>
                  <Button size="icon" variant="outline" className="aspect-square">
                    <Search className="size-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="aspect-square">
                    <Sparkles className="size-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="flex-grow overflow-auto">
              {rootItems.map(item => (
                <FolderTreeItem key={item.item_id} item={item} depth={0} onExpand={handleExpand} />
              ))}
            </div>
          </div>
        </div>
        <Button
          className="h-full w-2 hover:w-3 transition-all duration-200 rounded-none"
          onClick={toggleSidebar}
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
        <main className="flex-1 p-5">{children}</main>
      </div>
    </TooltipProvider>
  );
}