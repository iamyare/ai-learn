import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';

export type HighlighterAction = 'note' | 'explain' | 'chart' | 'translate';

interface HighlighterContextType {
  highlightedText: string;
  setHighlightedText: (text: string) => void;
  triggerAction: (action: HighlighterAction, text: string) => void;
  setActionHandler: (handler: (action: HighlighterAction, text: string) => void) => void;
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
  const actionHandlerRef = useRef<((action: HighlighterAction, text: string) => void) | null>(null);

  const setActionHandler = useCallback((handler: (action: HighlighterAction, text: string) => void) => {
    actionHandlerRef.current = handler;
  }, []);

  const triggerAction = useCallback((action: HighlighterAction, text: string) => {
    if (actionHandlerRef.current) {
      actionHandlerRef.current(action, text);
    } else {
      console.warn('Action handler not set');
    }
  }, []);

  useEffect(() => {
    return () => {
      actionHandlerRef.current = null;
    };
  }, []);

  return (
    <HighlighterContext.Provider 
      value={{ 
        highlightedText, 
        setHighlightedText, 
        triggerAction,
        setActionHandler
      }}
    >
      {children}
    </HighlighterContext.Provider>
  );
};