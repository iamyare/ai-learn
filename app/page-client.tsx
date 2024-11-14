/* eslint-disable @next/next/no-img-element */
'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { InView } from 'react-intersection-observer'
import Link from 'next/link'

export default function PageClient() {
  const logoAnimation = {
    initial: {
      scale: 4,
      y: '20vh'
    },
    animate: {
      scale: 1,
      y: 0,
      transition: {
        duration: 2,
        ease: [0.2, 0, 0.3, 1] // cubicBezier personalizado: muy lento al inicio, muy rápido al final
      }
    }
  }

  const nameAppAnimation = {
    initial: {
      opacity: 0,
      y: -20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.5,
        duration: 0.8
      }
    }
  }

  const contentAnimation = {
    initial: { opacity: 0, y: '50vh' },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0,
        duration: 1.5,
        ease: 'easeInOut'
      }
    }
  }

  const phoneContainerAnimation = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0 // Cambiado a 0 para que las animaciones ocurran al mismo tiempo
      }
    }
  }

  const phoneAnimation = (index: number) => {
    let initialY = 0
    let initialX = 0

    if (index === 2) {
      initialY = 50 // Centro, de abajo hacia arriba
    } else if (index < 2) {
      initialX = -50 // Izquierda, de izquierda a derecha
    } else {
      initialX = 50 // Derecha, de derecha a izquierda
    }

    return {
      hidden: {
        opacity: 0,
        y: initialY,
        x: initialX
      },
      visible: {
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
          delay: 1,
          duration: 0.5,
          ease: 'easeOut'
        }
      }
    }
  }

  return (
    <section id='hero'>
      <div className='sm:py-20 py-12 min-h-[100vh] w-full overflow-hidden'>
        <main className='mx-auto pt-16 sm:pt-24 md:pt-32 text-center relative px-4'>
          <div className='relative'>
            <motion.div
              className='mb-16 relative z-20'
              variants={logoAnimation}
              initial='initial'
              animate='animate'
            >
              <img
                src='/stick_note_logo.webp'
                className=' size-24 object-cover mx-auto'
                alt=''
              />
            </motion.div>
            <motion.div
              variants={nameAppAnimation}
              initial='initial'
              animate='animate'
              className='absolute inset-0 top-24 z-10 sout-gummy text-primary'
            >
              Stick Note
            </motion.div>
          </div>
          <motion.div
            variants={contentAnimation}
            initial='initial'
            animate='animate'
            className='max-w-5xl mx-auto'
          >
            <h1
              className='text-5xl font-bold mb-4 tracking-tighter'
              style={{ opacity: 1, willChange: 'auto' }}
            >
              Notebooks inteligentes impulsados por IA.
            </h1>
            <p
              className='max-w-2xl mx-auto text-xl mb-8 font-medium text-balance'
              style={{ opacity: 1, willChange: 'auto' }}
            >
              Cal AI transforms your speech into text instantly. Perfect for
              quick note-taking, content creation, and capturing ideas
              on-the-go.
            </p>
            <div className='flex justify-center  mb-16'>
              <Button size={'lg'} asChild>
                <Link href='/auth/login'>Iniciar Sesion</Link>
              </Button>
            </div>

            <InView triggerOnce threshold={0.5}>
              <motion.div
                variants={phoneContainerAnimation}
                initial='hidden'
                animate={'visible'}
                className='flex flex-nowrap items-center justify-center -space-x-20 sm:-space-x-20 h-auto select-none'
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <motion.div
                    key={index}
                    variants={phoneAnimation(index)}
                    className='flex-shrink-0'
                  >
                    <img
                      src={`/phone/device_${index + 1}.png`}
                      alt='iPhone'
                      className=' h-[333px] object-cover aspect-[2/3] sm:h-[600px] flex-shrink-0'
                    />
                  </motion.div>
                ))}
              </motion.div>
            </InView>
          </motion.div>
        </main>
      </div>
    </section>
  )
}
