'use client'
import { motion } from 'framer-motion'
import { InView } from 'react-intersection-observer'

export default function Container({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <InView triggerOnce threshold={0.5}>
      {({ inView, ref }) => (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </InView>
  )
}
