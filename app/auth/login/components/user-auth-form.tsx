'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { useTransition } from 'react'

import Link from 'next/link'
import { FacebookButton, GitHubButton, GoogleButton } from '@/components/oauth-buttons'
import { Icons } from '@/components/icons'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const validationSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'El correo electrónico es obligatorio' })
    .email({
      message: 'Debe ser un correo electrónico válido'
    }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
  //   "La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y tener al menos 6 caracteres"
  // ),
})

type ValidationSchema = z.infer<typeof validationSchema>

export function UserAuthForm () {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  function onSubmit (data: z.infer<typeof validationSchema>) {
    startTransition(async () => {
      console.log(data)
    })
  }

  return (
    <>
      <div className='flex gap-10 items-center w-full'>
      <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col w-full gap-2">
          <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className=' h-12 rounded-full' placeholder='Correo electronico' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                        <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type='password' className=' h-12 rounded-full' placeholder='Contrasena' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className=' h-12 rounded-full' disabled >
                Iniciar sesion
              </Button>
          </form>
        </Form>

        <span className=' text-2xl'>/</span>

        <div className='flex flex-col gap-2 w-full'>
            <GoogleButton className=' h-12 rounded-full  justify-start' />
            <GitHubButton className=' h-12 rounded-full  justify-start' />
            <FacebookButton className=' h-12 rounded-full  justify-start' />
        </div>
      </div>
    </>
  )
}
