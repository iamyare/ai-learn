'use client'
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type FolderPath = {
  id: string;
  name: string;
};

type FolderNavigationContextType = {
  currentPath: FolderPath[];
  setCurrentPath: React.Dispatch<React.SetStateAction<FolderPath[]>>;
  navigateToFolder: (folderId: string, folderName: string) => void;
  navigateUp: () => void;
  reload: () => void;
};

const FolderNavigationContext = createContext<FolderNavigationContextType | undefined>(undefined);

export const FolderNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<FolderPath[]>([{ id: 'root', name: 'Root' }]);
  const router = useRouter();

  const navigateToFolder = useCallback((folderId: string, folderName: string) => {
    setCurrentPath(prevPath => {
      const index = prevPath.findIndex(item => item.id === folderId);
      if (index !== -1) {
        // Si la carpeta ya está en el path, corta el path hasta esa carpeta
        return prevPath.slice(0, index + 1);
      } else {
        // Si es una nueva carpeta, añádela al final
        return [...prevPath, { id: folderId, name: folderName }];
      }
    });
  }, []);

  const navigateUp = useCallback(() => {
    setCurrentPath(prev => prev.slice(0, -1));
  }, []);

  const reload = useCallback(() => {
    // Forzar una actualización completa de la página
    router.refresh();
  }, [router]);

  return (
    <FolderNavigationContext.Provider value={{ currentPath, setCurrentPath, navigateToFolder, navigateUp, reload }}>
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