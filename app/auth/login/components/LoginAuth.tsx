'use client'
import Link from 'next/link'
import { UserAuthForm } from './user-auth-form'

export default function LoginAuth() {
  return (
    <main className='relative h-screen flex justify-center items-center'>
      <div className=' max-w-4xl  flex w-full flex-col justify-center items-center gap-16  '>
        <div className=' max-w-md  flex flex-col space-y-2 text-center my-2'>
          <h1 className='text-5xl font-medium tracking-tight libre-baskerville'>
            Inicia sesión en tu cuenta
          </h1>
          <p className='text-muted-foreground text-lg'>
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>
        <UserAuthForm />
        <p className='text-muted-foreground text-center'>
          ¿No tienes una cuenta?{' '}
          <Link
            href='/auth/signup'
            className=' text-foreground font-medium hover:text-primary pointer-events-none opacity-50'
          >
            Regístrate
          </Link>
        </p>
      </div>

     
    </main>
  )
}
