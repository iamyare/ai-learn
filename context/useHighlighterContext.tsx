'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Note {
  id: string;
  text: string;
  timestamp: string;
}

interface HighlighterContextType {
  highlightedText: string;
  setHighlightedText: (text: string) => void;
  addNote: (text: string) => void;
  notes: Note[];
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
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = useCallback((text: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toISOString()
    };
    setNotes(prevNotes => [...prevNotes, newNote]);
  }, []);

  return (
    <HighlighterContext.Provider 
      value={{ 
        highlightedText, 
        setHighlightedText, 
        addNote,
        notes
      }}
    >
      {children}
    </HighlighterContext.Provider>
  );
};