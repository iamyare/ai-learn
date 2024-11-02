'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { ChevronLeft } from 'lucide-react'

export default function ErrorPage({
  title,
  message
}: {
  title: string
  message: string
}) {
  return (
    <main className='flex flex-col items-center space-y-2 justify-center h-screen'>
      <header className=' flex flex-col text-center'>
        <h1 className='text-6xl font-bold'>{title}</h1>
        <p className='text-muted-foreground text-lg'>{message}</p>
      </header>
      <Button asChild>
        <Link href='/'>
          <ChevronLeft
            className=' size-5 mr-2
          '
          />
          Volver al inicio
        </Link>
      </Button>
    </main>
  )
}
