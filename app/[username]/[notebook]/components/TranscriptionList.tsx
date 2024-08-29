import React from 'react';
import { cn, formatDate } from '@/lib/utils';
import { CoursorText } from '@/components/ui/coursor-text';
import { DialogEntry } from '@/types/speechRecognition';

interface TranscriptionListProps {
  history: DialogEntry[];
  transcript: string;
  isListening: boolean;
  currentPosition: number;
  showPageNumbers: boolean;
  isPlaying: boolean;
  onPositionChange: (newPosition: number) => void;
}

const TranscriptionList: React.FC<TranscriptionListProps> = ({
  history,
  transcript,
  isListening,
  currentPosition,
  showPageNumbers,
  isPlaying,
  onPositionChange
}) => {

  const getCurrentParagraphAndWordIndex = () => {
    let accumulatedLength = 0;
    for (let i = 0; i < history.length; i++) {
      const words = history[i].text.split(' ');
      for (let j = 0; j < words.length; j++) {
        accumulatedLength += words[j].length + 1; // +1 for the space
        if (currentPosition < accumulatedLength) {
          return { paragraphIndex: i, wordIndex: j };
        }
      }
    }
    return { paragraphIndex: history.length - 1, wordIndex: history[history.length - 1].text.split(' ').length - 1 };
  };

  const { paragraphIndex: currentParagraphIndex, wordIndex: currentWordIndex } = getCurrentParagraphAndWordIndex();

  const handleWordClick = (paragraphIndex: number, wordIndex: number) => {
    let newPosition = 0;
    for (let i = 0; i < paragraphIndex; i++) {
      newPosition += history[i].text.length + 1; // +1 for newline
    }
    const words = history[paragraphIndex].text.split(' ');
    for (let i = 0; i < wordIndex; i++) {
      newPosition += words[i].length + 1; // +1 for space
    }
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
            index === currentParagraphIndex && isPlaying ? 'bg-yellow-100 dark:bg-yellow-800' : ''
          )}>
            {entry.text.split(' ').map((word, wordIndex) => (
              <span 
                key={wordIndex} 
                className={cn(
                  'cursor-pointer',
                  index === currentParagraphIndex && wordIndex === currentWordIndex && isPlaying ? 'bg-red-500' : ''
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