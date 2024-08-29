import React, { useEffect, useState, useCallback } from 'react';
import { cn, formatDate } from '@/lib/utils';
import { CoursorText } from '@/components/ui/coursor-text';
import { DialogEntry } from '@/types/speechRecognition';

interface TranscriptionListProps {
  history: DialogEntry[];
  transcript: string;
  isListening: boolean;
  currentPosition: number;
  showPageNumbers: boolean;
  onPositionChange: (newPosition: number) => void;
  isPlaying: boolean;
}

const TranscriptionList: React.FC<TranscriptionListProps> = ({
  history,
  transcript,
  isListening,
  currentPosition,
  showPageNumbers,
  onPositionChange,
  isPlaying
}) => {
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const getIndicesFromPosition = useCallback((position: number) => {
    let accumulatedLength = 0;
    for (let i = 0; i < history.length; i++) {
      const words = history[i].text.split(' ');
      for (let j = 0; j < words.length; j++) {
        const wordLength = words[j].length + 1; // +1 for the space
        if (position >= accumulatedLength && position < accumulatedLength + wordLength) {
          return { paragraphIndex: i, wordIndex: j };
        }
        accumulatedLength += wordLength;
      }
      accumulatedLength += 1; // +1 for newline between paragraphs
    }
    return { 
      paragraphIndex: history.length - 1, 
      wordIndex: history[history.length - 1].text.split(' ').length - 1 
    };
  }, [history]);

  useEffect(() => {
    const { paragraphIndex, wordIndex } = getIndicesFromPosition(currentPosition);
    setCurrentParagraphIndex(paragraphIndex);
    setCurrentWordIndex(wordIndex);
  }, [currentPosition, getIndicesFromPosition]);

  const handleWordClick = (paragraphIndex: number, wordIndex: number) => {
    let newPosition = 0;
    for (let i = 0; i < paragraphIndex; i++) {
      newPosition += history[i].text.length + 1; // +1 for newline
    }
    const words = history[paragraphIndex].text.split(' ');
    for (let i = 0; i < wordIndex; i++) {
      newPosition += words[i].length + 1; // +1 for space
    }
    newPosition += words[wordIndex].length; // Ajuste para la palabra actual
    onPositionChange(newPosition);
  };

  return (
    <ul className='space-y-1'>
      {history.map((entry, index) => (
        <li key={index} className='flex flex-col'>
          {showPageNumbers && (
            <span className='ml-2 text-muted-foreground text-sm'>
              [{formatDate(entry.timestamp || new Date(), 'datetime')}] -
              Página {entry.page || 'Unknown'}
            </span>
          )}
          <p className={cn(
            index === currentParagraphIndex ? 'bg-primary/5 p-1 rounded w-fit' : ''
          )}>
            {entry.text.split(' ').map((word, wordIndex) => (
              <span 
                key={wordIndex} 
                className={cn(
                  'cursor-pointer',
                  index === currentParagraphIndex && wordIndex === currentWordIndex ? 'bg-primary/20 px-1 py-0.5 rounded text-primary' : ''
                )}
                onClick={() => handleWordClick(index, wordIndex)}
              >
                {word}{' '}
              </span>
            ))}
          </p>
          {index === history.length - 1 && isListening && (
            <span>
              {transcript}
              <CoursorText />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TranscriptionList;