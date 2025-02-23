'use client'

import { cn } from "@/lib/utils"

export function CoursorText() {
  return (
    <div className='relative inline-block h-4 w-3 ml-1'>
      <span className='absolute h-4 w-[1.5px] bg-primary animate-pulse z-[1] rounded-md'></span>
      <div className='absolute size-2 top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 blur-sm bg-primary/20 animate-pulse '></div>
      <div className='absolute size-4 top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 blur-md bg-primary/50 animate-pulse '></div>
      <div className='absolute size-5 top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 blur-md bg-primary/50 animate-pulse '></div>
    </div>
  )
}

export function CoursorBouncy({ className, style }: { className?: string, style?: React.CSSProperties }) {
  return (
    <div className={cn('container-cursor', className)} style={{
      '--uib-color': `hsla(var(--muted-foreground)/0.2)`,
      '--uib-size': `1.5rem`,
      '--uib-speed': `1.5s`,
      ...style
    } as React.CSSProperties}>
      <div className='cube'>
        <div className='cube__inner'></div>
      </div>
      <div className='cube'>
        <div className='cube__inner'></div>
      </div>
      <div className='cube'>
        <div className='cube__inner'></div>
      </div>
    </div>
  )
}
