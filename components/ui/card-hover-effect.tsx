import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export const HoverEffect = ({
  items,
  className
}: {
  items: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    title: string
    description: string
    link: string
  }[]
  className?: string
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10',
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          href={item?.link}
          key={`${item?.link}-${idx}`} // Cambiar la clave para que sea única
          className='relative group  block p-2 h-full w-full'
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className='absolute inset-0 h-full w-full bg-muted block  rounded-3xl'
                layoutId='hoverBackground'
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 }
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 }
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <div className='bg-gradient-to-b from-primary to-primary/80 p-2 rounded-md text-white'>
              <item.icon className='size-6' />
            </div>

            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export const Card = ({
  className,
  children
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl h-full w-full p-2 overflow-hidden bg-background border border-transparent  group-hover:border-border relative z-20',
        className
      )}
    >
      <div className='relative z-50'>
        <div className='p-2 flex flex-col items-center text-center'>
          {children}
        </div>
      </div>
    </div>
  )
}
export const CardTitle = ({
  className,
  children
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <h4
      className={cn(
        'text-primary text-lg font-semibold tracking-wide mt-4',
        className
      )}
    >
      {children}
    </h4>
  )
}
export const CardDescription = ({
  className,
  children
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <p
      className={cn(
        'mt-4 text-muted-foreground tracking-wide leading-relaxed text-sm',
        className
      )}
    >
      {children}
    </p>
  )
}
