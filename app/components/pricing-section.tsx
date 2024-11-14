/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { InView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Check, ChevronRight } from 'lucide-react'

const Container = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
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

export default function PricingSection() {
  return (
    <section id='pricing' className=' -mt-36'>
      <div className='sm:py-20 py-12 container px-10'>
        <div className='text-center space-y-4 pb-10 mx-auto'>
          <h2 className='text-sm text-primary text-balance font-mono font-semibold tracking-wider uppercase'>
            Pricing
          </h2>
          <h3 className='mx-0 mt-4 max-w-lg text-5xl text-balance font-bold sm:max-w-none sm:text-4xl md:text-5xl lg:text-6xl leading-[1.2] tracking-tighter text-foreground lowercase'>
            simple pricing
          </h3>
        </div>
        <div className='flex justify-center items-center max-w-3xl mx-auto py-10'>
          <Container className='bg-muted/60 p-6 rounded-3xl grid grid-rows-[auto_auto_1fr_auto]'>
            <h2 className='text-2xl font-semibold mb-4'>Basic</h2>
            <div className='text-4xl font-bold text-primary mb-2'>
              $0
              <span className='text-sm font-normal text-muted-foreground'>
                /month
              </span>
            </div>
            <p className='text-sm text-muted-foreground mb-4'>
              Perfect for individual users
            </p>
            <div className='space-y-3 mb-6'>
              <div className='flex items-center'>
                <Check className=' size-6 mr-2 text-primary' />
                <span>AI-powered scheduling (up to 10 events/month)</span>
              </div>
              <div className='flex items-center'>
                <Check className=' size-6 mr-2 text-primary' />
                <span>Basic time blocking</span>
              </div>
              <div className='flex items-center'>
                <Check className=' size-6 mr-2 text-primary' />
                <span>Cloud sync for 1 device</span>
              </div>
              <div className='flex items-center'>
                <Check className=' size-6 mr-2 text-primary' />
                <span>Email reminders</span>
              </div>
            </div>
            <Button>
              Get Started
              <ChevronRight className=' size-5 ' />
            </Button>
          </Container>
          {/* <Container className='bg-muted/60 p-6 rounded-3xl grid grid-rows-[auto_auto_1fr_auto]'>
            <h2 className='text-2xl font-semibold mb-4'>Pro</h2>
            <div className='text-4xl font-bold text-primary mb-2'>
              $12
              <span className='text-sm font-normal text-muted-foreground'>
                /month
              </span>
            </div>
            <p className='text-sm text-muted-foreground mb-4'>
              Ideal for professionals and small teams
            </p>
            <div className='space-y-3 mb-6'>
              <div className='flex items-center'>
                <Check className=' size-6 mr-2 text-primary' />
                <span>Unlimited AI-powered scheduling</span>
              </div>
              <div className='flex items-center'>
                <Check className=' size-6 mr-2 text-primary' />
                <span>Advanced time blocking and analysis</span>
              </div>
              <div className='flex items-center'>
                <Check className=' size-6 mr-2 text-primary' />
                <span>Cloud sync for unlimited devices</span>
              </div>
              <div className='flex items-center'>
                <Check className=' size-6 mr-2 text-primary' />
                <span>Smart notifications across all devices</span>
              </div>
              <div className='flex items-center'>
                <Check className=' size-6 mr-2 text-primary' />
                <span>Team collaboration features</span>
              </div>
            </div>
            <Button>
              Get Started
              <ChevronRight className=' size-5 ' />
            </Button>
          </Container> */}
        </div>
      </div>
    </section>
  )
}
