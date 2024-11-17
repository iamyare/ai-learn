import React from 'react'
import { Header } from '../header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.'
  }),
  email: z.string().email({
    message: 'Please enter a valid email.'
  }),
  language: z.string({
    required_error: 'Please select a language.'
  })
})

export default function GeneralConfig() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      language: ''
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement the submit logic
    console.log(values)
  }

  return (
    <section className='flex flex-col gap-4 mb-52 md:mb-0'>
      <Header.Container>
        <Header.Title>Datos Generales del Usuario</Header.Title>
        <Header.Description>
          Actualiza tu información personal y preferencias de idioma.
        </Header.Description>
      </Header.Container>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de usuario</FormLabel>
                <FormControl>
                  <Input placeholder='Tu nombre de usuario' {...field} />
                </FormControl>
                <FormDescription>
                  Este es tu nombre público que se mostrará en tu perfil.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input placeholder='tu@ejemplo.com' {...field} />
                </FormControl>
                <FormDescription>
                  Tu dirección de correo electrónico principal.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='language'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idioma predeterminado para notebooks</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona un idioma' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='es'>🇭🇳 Español</SelectItem>
                    <SelectItem value='en'>🇺🇸 English</SelectItem>
                    <SelectItem value='fr'>🇫🇷 Français</SelectItem>
                    <SelectItem value='de'>🇩🇪 Deutsch</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Este será el idioma predeterminado para tus nuevos notebooks.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <footer className=' flex justify-end'>
            <Button type='submit'>Guardar cambios</Button>
          </footer>
        </form>
      </Form>
    </section>
  )
}
