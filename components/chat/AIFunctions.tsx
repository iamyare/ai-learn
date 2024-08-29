import React from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Network, Sparkles } from 'lucide-react'

interface AIFunctionsProps {
  importantEvents: () => void
  isPending: boolean
}

export default function AIFunctions({
  importantEvents,
  isPending
}: AIFunctionsProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-4">
        <Button
          type='button'
          size={'sm'}
          variant={'outline'}
          className='backdrop-blur-sm bg-background/70 flex-shrink-0'
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

        <Button
          type='button'
          size={'sm'}
          variant={'outline'}
          className='backdrop-blur-sm bg-background/70 flex-shrink-0'
          disabled={isPending}
          onClick={importantEvents} // Nota: Deberías crear una función separada para el mapa mental
        >
          {isPending ? (
            <div className='relative'>
              <div className='absolute size-3 bg-primary/50 blur-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'></div>
              <div className='absolute size-3 bg-primary blur-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'></div>
              <Network className='size-4 relative' />
            </div>
          ) : (
            <Network className='size-4' />
          )}
          <span className='ml-1'>Mapa mental</span>
        </Button>

        {/* Puedes agregar más botones aquí */}
      </div>
      <ScrollBar orientation="horizontal" className=' opacity-80 pt-1' />
    </ScrollArea>
  )
}