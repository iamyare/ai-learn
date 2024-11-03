'use client'
import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export const TextSparkles = ({
  text,
  className
}: {
  text: string
  className?: string
}) => {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className=' relative flex items-center'>
        <div className='overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white,transparent)]'>
          <p className='text-base sm:text-[3rem] py-10 font-bold bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/50'>
            {text}
          </p>
          <MemoizedStars />
        </div>
      </div>
    </div>
  )
}

const Stars = () => {
  const randomMove = () => Math.random() * 4 - 2
  const randomOpacity = () => Math.random()
  const random = () => Math.random()

  return (
    <div className='absolute inset-0'>
      {[...Array(80)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.2, 0]
          }}
          transition={{
            duration: random() * 10 + 20,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            top: `${random() * 100}%`,
            left: `${random() * 100}%`,
            width: `2px`,
            height: `2px`,
            backgroundColor: 'hsl(var(--primary))',
            borderRadius: '50%',
            zIndex: 1
          }}
          className='inline-block'
        />
      ))}
    </div>
  )
}

const MemoizedStars = memo(Stars)
