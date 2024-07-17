'use client'

import React, { useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from './ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ScrollArea } from './ui/scroll-area'

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty')
})

export default function Chat() {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: ''
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    form.reset()
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [])

  return (
    <section className='flex flex-col h-full max-h-full'>
      <header className='flex-none w-full py-2 px-4 bg-background'>
        <h1 className='text-lg font-semibold'>Chat</h1>
      </header>
      
      <ScrollArea className='flex-grow overflow-y-auto px-4' ref={scrollAreaRef}>
        <div className='space-y-4 py-4'>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className='bg-muted p-3 rounded-lg'>
              <span className='block text-muted-foreground text-sm mb-1'>
                {new Date().toISOString()} - Página 2
              </span>
              <p className='text-sm'>
                {i % 2 === 0
                  ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum id, lacinia turpis.'
                  : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum id, lacinia turpis. Nulla facilisi. Donec sit amet risus vel odio auctor malesuada.'
                }
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <footer className='flex-none w-full p-4 bg-background'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex space-x-2'>
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem className='flex-grow'>
                  <FormControl>
                    <Input placeholder='Escribe tu mensaje' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Enviar</Button>
          </form>
        </Form>
      </footer>
    </section>
  )
}