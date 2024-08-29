import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Mic, Play, Pause, SkipBack, SkipForward, StopCircle } from 'lucide-react';

interface TranscriptionControlsProps {
  isListening: boolean;
  isPlaying: boolean;
  isPending: boolean;
  onMicClick: () => Promise<void>;
  onPlayPauseClick: () => void;
  onStopClick: () => void;
  showPageNumbers: boolean; // Añadir esta línea
  onTogglePageNumbers: () => void;
}

const TranscriptionControls: React.FC<TranscriptionControlsProps> = ({
  isListening,
  isPlaying,
  isPending,
  onMicClick,
  onPlayPauseClick,
  onStopClick
}) => {
  return (
    <div className='flex gap-2 items-center'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size={'icon'} variant={'ghost'}>
              <SkipBack className='size-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>No disponible</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size={'icon'} 
              variant={'ghost'}
              onClick={onPlayPauseClick}
            >
              {isPlaying ? (
                <Pause className='size-4' />
              ) : (
                <Play className='size-4' />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isPlaying ? 'Pausar lectura' : 'Iniciar lectura'}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={'icon'}
              variant={'ghost'}
              onClick={onMicClick}
              disabled={isPending}
            >
              {isListening ? (
                <Mic className='size-4 text-red-500' />
              ) : (
                <Mic className='size-4' />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Presiona para comenzar a transcribir</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size={'icon'} 
              variant={'ghost'}
              onClick={onStopClick}
            >
              <StopCircle className='size-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Detener lectura</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size={'icon'} variant={'ghost'}>
              <SkipForward className='size-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>No disponible</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default TranscriptionControls;