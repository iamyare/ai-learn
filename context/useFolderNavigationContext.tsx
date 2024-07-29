'use client'
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type FolderPath = {
  id: string;
  name: string;
};

type FolderItem = {
  id: string;
  name: string;
  type: 'folder' | 'notebook';
  children?: FolderItem[];
};

type FolderNavigationContextType = {
  currentPath: FolderPath[];
  setCurrentPath: React.Dispatch<React.SetStateAction<FolderPath[]>>;
  navigateToFolder: (folderId: string, folderName: string) => void;
  navigateUp: () => void;
  reload: () => void;
  folderTree: FolderItem[];
  setFolderTree: React.Dispatch<React.SetStateAction<FolderItem[]>>;
  expandedFolders: Set<string>;
  toggleFolder: (folderId: string) => void;
  currentItemId: string | null;
};

const FolderNavigationContext = createContext<FolderNavigationContextType | undefined>(undefined);

export const FolderNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<FolderPath[]>([{ id: 'root', name: 'Root' }]);
  const [folderTree, setFolderTree] = useState<FolderItem[]>([
    { id: 'root', name: 'Root', type: 'folder', children: [] }
  ]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const router = useRouter();

  const navigateToFolder = useCallback((folderId: string, folderName: string) => {
    setCurrentPath(prevPath => {
      const index = prevPath.findIndex(item => item.id === folderId);
      if (index !== -1) {
        return prevPath.slice(0, index + 1);
      } else {
        return [...prevPath, { id: folderId, name: folderName }];
      }
    });
    setCurrentItemId(folderId);
  }, []);

  const navigateUp = useCallback(() => {
    setCurrentPath(prev => {
      const newPath = prev.slice(0, -1);
      setCurrentItemId(newPath[newPath.length - 1].id);
      return newPath;
    });
  }, []);

  const reload = useCallback(() => {
    router.refresh();
  }, [router]);

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

  return (
    <FolderNavigationContext.Provider 
      value={{ 
        currentPath, 
        setCurrentPath, 
        navigateToFolder, 
        navigateUp, 
        reload,
        folderTree,
        setFolderTree,
        expandedFolders,
        toggleFolder,
        currentItemId
      }}
    >
      {children}
    </FolderNavigationContext.Provider>
  );
};

export const useFolderNavigation = () => {
  const context = useContext(FolderNavigationContext);
  if (context === undefined) {
    throw new Error('useFolderNavigation must be used within a FolderNavigationProvider');
  }
  return context;
};