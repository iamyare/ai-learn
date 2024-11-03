import React, { useEffect, useState, useCallback } from 'react';
import { cn, formatDate } from '@/lib/utils';
import { CoursorText } from '@/components/ui/coursor-text';
import { DialogEntry, VisualizationOptions } from '@/types/speechRecognition';
import { format } from '@formkit/tempo';
import { Calendar, Clock, FileIcon } from 'lucide-react';

interface TranscriptionListProps {
  history: DialogEntry[];
  transcript: string;
  isListening: boolean;
  currentPosition: number;
  showPageNumbers: boolean;
  onPositionChange: (newPosition: number) => void;
  isPlaying: boolean;
  visualizationOptions: VisualizationOptions
}

const TranscriptionList: React.FC<TranscriptionListProps> = ({
  history,
  transcript,
  isListening,
  currentPosition,
  onPositionChange,
  visualizationOptions
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
    <ul className='space-y-4'>
      {history.map((entry, index) => (
        <li key={index} className='flex flex-col'>
                {(visualizationOptions.showDate || visualizationOptions.showTime || visualizationOptions.showPage) && (
                  <p className='ml-2 text-muted-foreground flex text-sm gap-2'>
                    {visualizationOptions.showDate && (
                      <span className='flex items-center'>
                        <Calendar className=' size-3 mr-1' />
                        {format(entry.timestamp, 'medium')}
                      </span>
                    )}
                    {visualizationOptions.showTime && (
                      <span className='flex items-center'>
                        <Clock className=' size-3 mr-1' />
                        {format(entry.timestamp, 'HH:mm:ss')}
                      </span>
                    )}
                    {visualizationOptions.showPage && entry.page && (
                      <span className='flex items-center'>
                        <FileIcon className=' size-3 mr-1' />
                        Página {entry.page}
                      </span>
                    )}
                  </p>
                )}
<p className={cn(
  index === currentParagraphIndex ? 'bg-primary/5 p-1 rounded w-fit' : ''
)}>
  {entry.text.split(' ').map((word, wordIndex) => (
    <span 
      key={wordIndex}
      // Solo asignar ID si es la palabra activa actual
      {...(index === currentParagraphIndex && wordIndex === currentWordIndex 
        ? { id: `active-word` } 
        : {})}
      className={cn(
        'cursor-pointer',
        index === currentParagraphIndex && wordIndex === currentWordIndex 
          ? 'bg-primary/20 px-1 py-0.5 rounded text-primary' 
          : ''
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