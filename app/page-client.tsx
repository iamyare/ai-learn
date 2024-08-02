'use client'
import NabarClient from '@/components/navbar-client'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from "@/components/ui/use-media-query"
import { useTheme } from "next-themes"
import Link from 'next/link'

export default function PageClient({user}:{user: User | null}) {
    const isDesktop = useMediaQuery('(min-width: 768px)')
    //obtenr el valor de la variable isDarkMode con next-themes
    const isDarkMode = useTheme().resolvedTheme === 'dark'
  
  return (
    <main className='relative overflow-hidden flex flex-col justify-between min-h-screen w-screen px-4 md:px-8'>
      <header className='h-12 mb-2'>
        <h1 className='sr-only'>Aplicación de Notebooks Inteligentes</h1>
        <NabarClient user={user} />
      </header>
      <section
        className='relative flex flex-col md:flex-row w-full items-center justify-between md:px-0 md:pl-20 xl:pl-40'
        aria-labelledby='main-heading'
      >
        <div className='flex flex-col gap-6 max-w-lg w-full md:w-1/2'>
          <h2
            id='main-heading'
            className='text-4xl md:text-5xl font-semibold text-violet-950 dark:text-primary'
          >
            Potencia tu productividad con Notebooks Inteligentes
          </h2>
          <p className='text-lg'>
            Revoluciona tu forma de trabajar con nuestra aplicación que integra
            PDFs, transcripción en tiempo real y chat con IA. Organiza, analiza
            y crea contenido de manera más eficiente que nunca.
          </p>
          {user ? (
            <Button
              className='w-fit px-6 py-2 '
              aria-label='Descubre más sobre nuestras funcionalidades'
              asChild
            >
              <Link href={user.username}>Ir a la aplicación</Link>
            </Button>
          ) : (
            <Button
              className='w-fit px-6 py-2 '
              aria-label='Descubre más sobre nuestras funcionalidades'
              asChild
            >
              <Link href={'auth/login'}>Inicia sesión</Link>
            </Button>
          )}
        </div>

        {isDesktop ? (
          <img
            src={
              isDarkMode
                ? 'https://udmwntxrpzjwqptmwozr.supabase.co/storage/v1/object/public/public_bucket/photo_landing_dark.webp'
                : 'https://udmwntxrpzjwqptmwozr.supabase.co/storage/v1/object/public/public_bucket/photo_landing.webp'
            }
            alt='Interfaz de usuario de la aplicación Notebooks Inteligentes mostrando un PDF y un chat con IA'
            className='w-[70%] absolute top-1/2 -translate-y-1/2 left-[45%]'
          />
        ) : (
          <img
            src={
              isDarkMode
                ? 'https://udmwntxrpzjwqptmwozr.supabase.co/storage/v1/object/public/public_bucket/photo_landingpage_phone_dark.webp'
                : 'https://udmwntxrpzjwqptmwozr.supabase.co/storage/v1/object/public/public_bucket/photo_landingpage_phone.webp'
            }
            alt='Vista móvil de la aplicación Notebooks Inteligentes con un notebook y chat integrado'
            className='w-full mt-8'
          />
        )}
      </section>
      <footer className='flex flex-col items-center w-full  mb-5 md:mt-0 space-y-4'>
        <p className='text-muted-foreground text-center max-w-2xl'>
          Únete a miles de profesionales que ya están optimizando su flujo de
          trabajo. Descubre cómo nuestras herramientas de IA pueden transformar
          tu productividad hoy mismo.
        </p>
        <nav aria-label='Enlaces de información adicional'>
          <ul className='flex space-x-4'>
            <li>
              <a href='#features' className='text-primary hover:underline'>
                Características
              </a>
            </li>
            <li>
              <a href='#pricing' className='text-primary hover:underline'>
                Precios
              </a>
            </li>
            <li>
              <a href='#contact' className='text-primary hover:underline'>
                Contacto
              </a>
            </li>
          </ul>
        </nav>
      </footer>

      <div
        aria-hidden='true'
        className='absolute w-[400px] h-[400px] top-1/2 right-1/4 -translate-y-1/3 bg-blue-500 -z-10 blur-[200px] opacity-60'
      ></div>
      <div
        aria-hidden='true'
        className='absolute w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary -z-10 opacity-60 blur-[200px]'
      ></div>
    </main>
  )
}
