/* eslint-disable @next/next/no-img-element */
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { InView } from 'react-intersection-observer'
import Link from 'next/link'
import { useEffect } from 'react'
import { BackgroundLines } from '@/components/ui/background-lines'
import { RainbowButton } from '@/components/ui/RainbowButton'
import { RocketIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { GoogleButtonStyle } from '@/components/oauth-buttons'

export default function HeroSection({ user }: { user: User | null }) {
  const router = useRouter()
  const handleLogin = () => {
    router.push('/auth/login')
  }
  useEffect(() => {
    const images = Array.from({ length: 5 }).map(
      (_, i) => `/phone/device_${i + 1}.png`
    )
    images.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  const logoAnimation = {
    initial: {
      scale: 4,
      y: '20vh'
    },
    animate: {
      scale: 1,
      y: 0,
      transition: {
        duration: 1.5,
        ease: [0.4, 0, 0.3, 1] // cubicBezier personalizado: más lento al inicio, muy rápido al final
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
        delay: 1,
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
      initialY = 50
    } else if (index < 2) {
      initialX = -50
    } else {
      initialX = 50
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
          delay: 0.8, // Agregamos un pequeño delay escalonado
          duration: 0.6,
          ease: 'easeOut'
        }
      }
    }
  }

  const { scrollYProgress } = useScroll()

  // Crear transformaciones individuales para cada imagen
  const yPosScrolls = [
    useTransform(scrollYProgress, [0, 0.2], [90, 0]), // Primera imagen
    useTransform(scrollYProgress, [0, 0.2], [40, 0]), // Segunda imagen
    useTransform(scrollYProgress, [0, 0.2], [0, 0]), // Imagen central
    useTransform(scrollYProgress, [0, 0.2], [40, 0]), // Cuarta imagen
    useTransform(scrollYProgress, [0, 0.2], [90, 0]) // Quinta imagen
  ]

  return (
    <section id='hero' className=' flex relative '>
      <div className=' absolute inset-0 top-0 left-0 '>
        <BackgroundLines className='relative h-full w-full  '>
          <div className='absolute top-0 left-0 h-full w-full bg-[radial-gradient(hsla(var(--muted-foreground)/0.2)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]'></div>

          <div className='absolute top-0 z-[-2] h-screen w-screen  bg-[radial-gradient(100%_50%_at_50%_0%,hsla(var(--primary)/0.2)_0,hsla(var(--primary)/0.1)_20%,rgba(0,163,255,0)_100%)]'></div>
        </BackgroundLines>
      </div>
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
              Convierte tus clases en notas perfectamente organizadas con un
              solo clic. Di adiós a los apuntes perdidos.
            </p>
            <div className='flex justify-center  mb-16'>
              {user ? (
                <RainbowButton className=' '>
                  <Link href='/auth/login' className=' inline-flex'>
                    Iniciar a la aplicacion
                    <RocketIcon className='size-5 ml-2' />
                  </Link>
                </RainbowButton>
              ) : (
                <GoogleButtonStyle />
              )}
            </div>

            <InView triggerOnce threshold={0.1}>
              {({ inView, ref }) => (
                <motion.div
                  ref={ref}
                  variants={phoneContainerAnimation}
                  initial='hidden'
                  animate='visible'
                  className='flex flex-nowrap items-center justify-center -space-x-20 sm:-space-x-28 h-auto select-none'
                  style={{ willChange: 'transform' }} // Optimización de rendimiento
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <motion.div
                      key={index}
                      variants={phoneAnimation(index)}
                      style={{
                        y: inView
                          ? yPosScrolls[index]
                          : yPosScrolls[index].get(),
                        willChange: 'transform, opacity' // Optimización de rendimiento
                      }}
                      className='flex-shrink-0'
                    >
                      <img
                        src={`/phone/device_${index + 1}.png`}
                        alt={`iPhone preview ${index + 1}`}
                        loading='lazy'
                        className='h-[333px] object-cover aspect-[2/3] sm:h-[600px] flex-shrink-0'
                        style={{ willChange: 'transform' }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </InView>
          </motion.div>
        </main>
      </div>
    </section>
  )
}
