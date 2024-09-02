import FlickeringGrid from '@/components/ui/flickering-grid'
import { cn } from '@/lib/utils'
import React from 'react'

export default function MessageLoading({
  className,
  text = 'Generando'
}: {
  className?: string
  text?: string
}) {
  return (
    <div
      className={cn(
        'relative h-[200px] w-full flex items-center justify-center rounded-2xl overflow-hidden border mt-4',
        className
      )}
    >
      <FlickeringGrid
        className='z-0 absolute top-0 left-0 bottom-0 right-0 inset-0 size-full'
        squareSize={4}
        gridGap={6}
        color='#6B7280'
        maxOpacity={0.4}
        flickerChance={0.1}
        height={200}
      />
      <div className=' text-center text-muted-foreground text-2xl font-semibold animate-pulse'>
        {text}
      </div>
    </div>
  )
}
