/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { InView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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

export default function FeatureSection() {
  return (
    <section id='feature-highlight' className=' -mt-12 md:-mt-32'>
      <div className='sm:py-20 py-12 container px-10'>
        <div className='text-center space-y-4 pb-10 mx-auto'>
          <h2
            className='text-sm text-primary text-balance font-mono font-semibold tracking-wider uppercase'
            style={{ opacity: 1, transform: 'none' }}
          >
            Features
          </h2>
          <h3
            className='mx-0 mt-4 max-w-lg text-5xl text-balance font-bold sm:max-w-none sm:text-4xl md:text-5xl lg:text-6xl leading-[1.2] tracking-tighter text-foreground lowercase'
            style={{ opacity: 1, transform: 'none' }}
          >
            Powerful features
          </h3>
        </div>
        <div className='flex flex-col items-center justify-between pb-10 transition-all duration-500 ease-out lg:flex-row-reverse'>
          <Container className='w-full lg:w-1/2 mb-10 lg:mb-0 lg:pl-8'>
            <div className='flex flex-col gap-4 max-w-sm text-center lg:text-left mx-auto'>
              <h2
                className='text-4xl md:text-5xl lg:text-6xl font-bold'
                style={{ opacity: 1, willChange: 'auto', transform: 'none' }}
              >
                AI-Powered Scheduling
              </h2>
              <p
                className='text-xl md:text-2xl'
                style={{ opacity: 1, willChange: 'auto', transform: 'none' }}
              >
                Intelligent scheduling that learns your preferences and
                optimizes your time.
              </p>
              <div
                style={{ opacity: 1, willChange: 'auto', transform: 'none' }}
              >
                <Button asChild>
                  <Link href='#hero'>Comenzar</Link>
                </Button>
              </div>
            </div>
          </Container>
          <div className='w-full lg:w-1/2'>
            <img
              src='/desktop/desktop_1.png'
              alt='AI-Powered Scheduling'
              className='w-[100%] object-cover aspect-[4/3] mx-auto'
            />
          </div>
        </div>
        <div className='flex flex-col items-center justify-between pb-10 transition-all duration-500 ease-out lg:flex-row'>
          <Container className='w-full lg:w-1/2 mb-10 lg:mb-0 lg:pr-8'>
            <div className='flex flex-col gap-4 max-w-sm text-center lg:text-left mx-auto'>
              <h2
                className='text-4xl md:text-5xl lg:text-6xl font-bold'
                style={{
                  opacity: 1,
                  willChange: 'auto',
                  transform: 'none'
                }}
              >
                Smart Time Blocking
              </h2>
              <p
                className='text-xl md:text-2xl'
                style={{
                  opacity: 1,
                  willChange: 'auto',
                  transform: 'none'
                }}
              >
                Automatically block time for focused work and personal
                activities.
              </p>
              <div
                style={{
                  opacity: 1,
                  willChange: 'auto',
                  transform: 'none'
                }}
              >
                <a
                  className='inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-11 px-8 text-white rounded-full group text-lg mx-auto lg:mx-0'
                  href='#'
                >
                  Get Started
                </a>
              </div>
            </div>
          </Container>
          <div className='w-full lg:w-1/2'>
            <img
              src='/desktop/desktop_2.png'
              alt='Smart Time Blocking'
              className='w-[100%] object-cover aspect-[4/3] mx-auto'
            />
          </div>
        </div>
        <div className='flex flex-col items-center justify-between pb-10 transition-all duration-500 ease-out lg:flex-row-reverse'>
          <Container className='w-full lg:w-1/2 mb-10 lg:mb-0 lg:pl-8'>
            <div className='flex flex-col gap-4 max-w-sm text-center lg:text-left mx-auto'>
              <h2
                className='text-4xl md:text-5xl lg:text-6xl font-bold'
                style={{
                  opacity: 1,
                  willChange: 'auto',
                  transform: 'none'
                }}
              >
                Predictive Event Planning
              </h2>
              <p
                className='text-xl md:text-2xl'
                style={{
                  opacity: 1,
                  willChange: 'auto',
                  transform: 'none'
                }}
              >
                AI suggests optimal times for meetings and events based on your
                habits.
              </p>
              <div
                style={{
                  opacity: 1,
                  willChange: 'auto',
                  transform: 'none'
                }}
              >
                <a
                  className='inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-11 px-8 text-white rounded-full group text-lg mx-auto lg:mx-0'
                  href='#'
                >
                  Get Started
                </a>
              </div>
            </div>
          </Container>
          <div className='w-full lg:w-1/2'>
            <img
              src='/phone/device_5.png'
              alt='Predictive Event Planning'
              className='w-[70%] object-cover aspect-[2/3] mx-auto'
            />
          </div>
        </div>
      </div>
    </section>
  )
}
