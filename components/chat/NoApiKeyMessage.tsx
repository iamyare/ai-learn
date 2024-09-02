import React from 'react'
import { cn } from '@/lib/utils'

export default function NoApiKeyMessage({ className }: { className?: string }) {
  return (
    <div className={cn('flex justify-center items-center h-full w-full p-4', className)}>
      <p className='text-muted-foreground text-center'>
        Considera ingresar el API KEY necesaria en la configuración
      </p>
    </div>
  )
}
