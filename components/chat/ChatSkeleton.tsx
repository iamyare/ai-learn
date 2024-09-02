import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export default function ChatSkeleton({ className }: { className?: string }) {
  return (
    <section className={cn('flex flex-col max-w-full w-full overflow-hidden h-full max-h-full', className)}>
      <header className='flex-none w-full py-2 px-4 bg-background'>
        <Skeleton className='h-6 w-24' />
      </header>
      <div className='flex-grow overflow-y-auto pb-16 px-4'>
        <div className='space-y-4'>
          {[...Array(3)].map((_, index) => (
            <div key={index} className='flex flex-col gap-2'>
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          ))}
        </div>
      </div>
      <footer className='w-full p-4'>
        <div className='flex space-x-2'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-20' />
        </div>
      </footer>
    </section>
  )
}