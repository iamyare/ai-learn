'use client'

import { Input } from '@/components/ui/input'
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

const formSchema = z.object({
  username: z.string()
})

export default function Chat() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: ''
    }
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <section className='w-full h-full  relative px-4'>
      <header className=' w-full py-2 px-4'>
        <h1>Chat</h1>
      </header>
      <aside className='flex flex-col h-full gap-10 overflow-y-auto'>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
        <p>Chat</p>
      </aside>

      <footer className='absolute w-[90%] px-2 py-1 rounded-full bg-background/50 backdrop-blur-sm bottom-4 left-1/2 -translate-x-1/2 '>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8 relative'
          >
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Escribe tu mensaje' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </footer>
    </section>
  )
}
