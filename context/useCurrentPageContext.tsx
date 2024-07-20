import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CurrentPageContextType {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const CurrentPageContext = createContext<CurrentPageContextType | undefined>(undefined);

export const useCurrentPage = () => {
  const context = useContext(CurrentPageContext);
  if (!context) {
    throw new Error('useCurrentPage must be used within a CurrentPageProvider');
  }
  return context;
};

interface CurrentPageProviderProps {
  children: ReactNode;
}

export const CurrentPageProvider: React.FC<CurrentPageProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  return (
    <CurrentPageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </CurrentPageContext.Provider>
  );
};