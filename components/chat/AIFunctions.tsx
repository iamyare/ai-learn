import React from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

interface AIFunctionsProps {
  importantEvents: () => void;
  isPending: boolean;
}

export default function AIFunctions({ importantEvents, isPending }: AIFunctionsProps) {
  return (
    <div className='flex gap-2'>
      <Button
        type='button'
        size={'sm'}
        variant={'outline'}
        className='backdrop-blur-sm bg-background/70'
        disabled={isPending}
        onClick={importantEvents}
      >
        {isPending ? (
          <div className='relative'>
            <div className='absolute size-3 bg-primary/50 blur-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'></div>
            <div className='absolute size-3 bg-primary blur-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'></div>
            <Sparkles className='size-4 relative' />
          </div>
        ) : (
          <Sparkles className='size-4' />
        )}
        <span className='ml-1'>Eventos importantes</span>
      </Button>
      {/* Aquí puedes agregar más botones para otras funciones de IA */}
    </div>
  )
}