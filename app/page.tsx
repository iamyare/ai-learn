'use client'

import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className='relative flex flex-col justify-between h-screen w-screen'>
      <header></header>
      <section className=' flex w-full items-center justify-between'>
        <aside className='flex flex-col gap-4 max-w-md w-full'>
          <h1 className=' text-5xl font-semibold text-violet-950'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt
            dolore inventore impedit. Omnis fugit sit aut officia nihil. Libero
            non accusamus facilis omnis quasi, molestiae doloribus. Voluptatibus
            velit eligendi atque!
          </p>
          <Button className=' w-fit'>Ver más</Button>
        </aside>

        <aside>Imagen</aside>
      </section>
      <section className=' flex flex-col items-center w-full'>
        <p className=' text-muted-foreground'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
          consequatur, assumenda minima nobis dolorum doloribus, ipsum facilis
          eum ipsam explicabo molestias?
        </p>
        <div>Otrac osas</div>
      </section>

      <div className='absolute size-[400px] top-1/2 right-1/4  -translate-y-1/3 bg-blue-500 -z-10 blur-[1500px] opacity-60'></div>
      <div className='absolute size-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary -z-10 opacity-60 blur-[1500px]'></div>
    </main>
  )
}
