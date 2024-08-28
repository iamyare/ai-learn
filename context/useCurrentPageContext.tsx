'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PDFContextType {
  fileUrl: string;
  setFileUrl: (url: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;

}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

export const usePDFContext = () => {
  const context = useContext(PDFContext);
  if (!context) {
    throw new Error('usePDFContext must be used within a PDFProvider');
  }
  return context;
};

interface PDFProviderProps {
  children: ReactNode;
}

export const PDFProvider: React.FC<PDFProviderProps> = ({ children }) => {
  const [fileUrl, setFileUrl] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  return (
    <PDFContext.Provider value={{ fileUrl, setFileUrl, currentPage, setCurrentPage }}>
      {children}
    </PDFContext.Provider>
  );
};