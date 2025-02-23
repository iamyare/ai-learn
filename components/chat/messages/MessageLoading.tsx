import { WordRotate } from '@/components/ui/word-rotate'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import React from 'react'

export default function MessageLoading({
  className,
}: {
  className?: string
}) {
  return (
    
    <motion.div
      className={cn(
        'relative h-[200px] w-full  mt-4',
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 12,
        mass: 0.8
      }}
    >
    <div className=' absolute inset-0 bg-background z-10 flex items-center justify-center'>
    <WordRotate
      className='text-2xl font-semibold text-white'
      words={[
        'Generando...',
        'Analizando datos',
        'Procesando...',
        'Casi listo'
      ]}
      duration={2000}
    />
    <div className=' gradient' style={{
      '--speed': '5s',
    } as React.CSSProperties}></div>
    </div>
    </motion.div>
  )
}
