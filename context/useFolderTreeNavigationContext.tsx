'use client'
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';



type FolderTreeNavigationContextType = {
  folderTree: FolderItem[];
  setFolderTree: React.Dispatch<React.SetStateAction<FolderItem[]>>;
  expandedFolders: Set<string>;
  toggleFolder: (folderId: string) => void;
  navigateToItem: (itemId: string) => void;
  currentItemId: string | null;
  reload: () => void;
};

const FolderTreeNavigationContext = createContext<FolderTreeNavigationContextType | undefined>(undefined);

export const FolderTreeNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [folderTree, setFolderTree] = useState<FolderItem[]>([
    { id: 'root', name: 'Root', type: 'folder', children: [] }
  ]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const router = useRouter();

  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);

  const navigateToItem = useCallback((itemId: string) => {
    setCurrentItemId(itemId);
    // Aquí puedes agregar lógica para actualizar la URL o realizar otras acciones
    // router.push(`/item/${itemId}`);
  }, []);

  const reload = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <FolderTreeNavigationContext.Provider 
      value={{ 
        folderTree, 
        setFolderTree, 
        expandedFolders, 
        toggleFolder, 
        navigateToItem, 
        currentItemId, 
        reload 
      }}
    >
      {children}
    </FolderTreeNavigationContext.Provider>
  );
};

export const useFolderTreeNavigation = () => {
  const context = useContext(FolderTreeNavigationContext);
  if (context === undefined) {
    throw new Error('useFolderTreeNavigation must be used within a FolderTreeNavigationProvider');
  }
  return context;
};