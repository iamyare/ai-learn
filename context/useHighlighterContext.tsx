'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type HighlighterAction = 'note' | 'explain' | 'chart' | 'translate';

interface HighlighterContextType {
  highlightedText: string;
  setHighlightedText: (text: string) => void;
  triggerAction: (handler: (action: HighlighterAction) => void) => void;
}

const HighlighterContext = createContext<HighlighterContextType | undefined>(undefined);

export const useHighlighter = () => {
  const context = useContext(HighlighterContext);
  if (context === undefined) {
    throw new Error('useHighlighter must be used within a HighlighterProvider');
  }
  return context;
};

interface HighlighterProviderProps {
  children: ReactNode;
}

export const HighlighterProvider: React.FC<HighlighterProviderProps> = ({ children }) => {
  const [highlightedText, setHighlightedText] = useState<string>('');
  const [actionHandler, setActionHandler] = useState<((action: HighlighterAction) => void) | null>(null);

  const triggerAction = useCallback((handler: (action: HighlighterAction) => void) => {
    setActionHandler(() => handler);
  }, []);

  const handleAction = useCallback((action: HighlighterAction) => {
    if (actionHandler) {
      actionHandler(action);
    }
  }, [actionHandler]);

  return (
    <HighlighterContext.Provider 
      value={{ 
        highlightedText, 
        setHighlightedText, 
        triggerAction
      }}
    >
      {children}
    </HighlighterContext.Provider>
  );
};