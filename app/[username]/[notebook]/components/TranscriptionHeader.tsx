
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Cloudy, CloudOff } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { MoreOptionsTranscript } from './more-options';

interface TranscriptionHeaderProps {
  isUpdated: boolean;
  lastUpdateTime: Date | null;
}

const TranscriptionHeader: React.FC<TranscriptionHeaderProps> = ({ isUpdated, lastUpdateTime }) => {
  return (
    <header className="flex justify-between items-center p-2 ">
      <span></span>
      <div className='flex items-center gap-2'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {isUpdated ? (
                <Cloudy className='size-4 text-muted-foreground' />
              ) : (
                <CloudOff className='size-4 text-muted-foreground' />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isUpdated
                  ? `Última actualización: ${formatDate(lastUpdateTime || new Date())}`
                  : 'No hay actualizaciones o error al guardar'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <MoreOptionsTranscript />
      </div>
    </header>
  );
};

export default TranscriptionHeader;