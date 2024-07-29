'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Settings } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { useApiKeys } from '@/context/useAPIKeysContext'
import Link from 'next/link'

const formSchema = z.object({
  gemini_key: z.string().min(1, 'Gemini Key is required'),
  user_id: z.string().min(1, 'User id is required')
})

export default function ConfigModal() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { apiKeys, updateApiKeys, user_id } = useApiKeys()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gemini_key: apiKeys.gemini_key || '',
      user_id: user_id
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      updateApiKeys({ gemini_key: values.gemini_key })
      // Aquí puedes manejar la actualización del user_id si es necesario
      console.log(values)
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon'>
          <Settings className='size-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Configuración</DialogTitle>
          <DialogDescription>
            Configura tus claves de API para un correcto funcionamiento.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='gemini_key'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='Gemini API Key'
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Puedes obtener tu Gemini API Key en tu cuenta de Gemini o
                    dando click{' '}
                    <Link
                      href='https://exchange.gemini.com/settings/api'
                      className=' underline'
                      target='_blank'
                      rel='noreferrer'
                    >
                      aquí
                    </Link>
                    .
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
