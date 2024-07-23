import React, { createContext, useContext, useState } from 'react';

type FolderPath = {
  id: string;
  name: string;
};

type FolderNavigationContextType = {
  currentPath: FolderPath[];
  navigateToFolder: (folderId: string, folderName: string) => void;
  navigateUp: () => void;
};

const FolderNavigationContext = createContext<FolderNavigationContextType | undefined>(undefined);

export const FolderNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<FolderPath[]>([{ id: 'root', name: 'Root' }]);

  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentPath(prev => [...prev, { id: folderId, name: folderName }]);
  };

  const navigateUp = () => {
    setCurrentPath(prev => prev.slice(0, -1));
  };

  return (
    <FolderNavigationContext.Provider value={{ currentPath, navigateToFolder, navigateUp }}>
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