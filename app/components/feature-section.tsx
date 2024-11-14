/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

import Container from '@/components/ui/container-animation'

export default function FeatureSection() {
  return (
    <section id='feature-highlight' className=' -mt-12 md:-mt-32'>
      <div className='sm:py-20 py-12 container px-10'>
        <div className='text-center space-y-4 pb-10 mx-auto'>
          <h2
            className='text-sm text-primary text-balance font-mono font-semibold tracking-wider uppercase'
            style={{ opacity: 1, transform: 'none' }}
          >
            Características
          </h2>
          <h3
            className='mx-0 mt-4 max-w-lg text-5xl text-balance font-bold sm:max-w-none sm:text-4xl md:text-5xl lg:text-6xl leading-[1.2] tracking-tighter text-foreground'
            style={{ opacity: 1, transform: 'none' }}
          >
            Todo lo que necesitas para destacar
          </h3>
        </div>
        <div className='flex flex-col items-center justify-between pb-10 transition-all duration-500 ease-out lg:flex-row-reverse'>
          <Container className='w-full lg:w-1/2 mb-10 lg:mb-0 lg:pl-8'>
            <div className='flex flex-col gap-4 max-w-sm text-center lg:text-left mx-auto'>
              <h2
                className='text-4xl md:text-5xl lg:text-6xl font-bold'
                style={{ opacity: 1, willChange: 'auto', transform: 'none' }}
              >
                Transcripción Inteligente
              </h2>
              <p
                className='text-xl md:text-2xl'
                style={{ opacity: 1, willChange: 'auto', transform: 'none' }}
              >
                Concéntrate en entender, no en escribir. Nuestra IA captura cada
                palabra importante mientras tú te sumerges en la clase.
              </p>
              <div
                style={{ opacity: 1, willChange: 'auto', transform: 'none' }}
              >
                <Button asChild>
                  <Link href='#hero'>Pruébalo ahora</Link>
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
                Organización Personalizada
              </h2>
              <p
                className='text-xl md:text-2xl'
                style={{
                  opacity: 1,
                  willChange: 'auto',
                  transform: 'none'
                }}
              >
                Tu espacio, tus reglas. Crea carpetas con colores, anida
                notebooks dentro de otras carpetas y organiza tu contenido como
                mejor te funcione.
              </p>
              <div
                style={{
                  opacity: 1,
                  willChange: 'auto',
                  transform: 'none'
                }}
              >
                <Button asChild>
                  <Link href='#hero'>Descubre cómo</Link>
                </Button>
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
                Asistente de Estudio Inteligente
              </h2>
              <p
                className='text-xl md:text-2xl'
                style={{
                  opacity: 1,
                  willChange: 'auto',
                  transform: 'none'
                }}
              >
                Obtén resúmenes automáticos, mapas mentales y gráficos visuales
                que transforman tus apuntes en contenido fácil de entender.
              </p>
              <div
                style={{
                  opacity: 1,
                  willChange: 'auto',
                  transform: 'none'
                }}
              >
                <Button asChild>
                  <Link href='#hero'>Descubre cómo</Link>
                </Button>
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
