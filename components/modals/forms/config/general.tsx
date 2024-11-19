import React, { useState } from 'react'
import { Header } from '../header'
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
import { useUserStore } from '@/store/useUserStore'
import { AvatarDropzone } from './components/AvatarDropzone'
import { checkUsernameAvailability, updateUser } from '@/actions'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LoaderCircleIcon, SaveIcon } from 'lucide-react'

async function uploadAvatar(file: File, userId: string) {
  const { data, error } = await supabase.storage
    .from('avatar_users')
    .upload(`${userId}-${Date.now()}`, file)

  return { data, error }
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'El nombre de usuario debe tener al menos 2 caracteres.'
  }),
  email: z.string().email({
    message: 'Por favor, introduce un correo electrónico válido.'
  }),
  full_name: z.string().optional(),
  avatar_url: z.string().optional()
})

export default function GeneralConfig() {
  const user = useUserStore((state) => state.user)
  const router = useRouter()

  // Añadir verificación de seguridad
  if (!user) {
    router.push('/login') // o donde quieras redirigir si no hay usuario
    return null
  }

  const [isLoading, setIsLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username ?? '',
      full_name: user?.full_name ?? '',
      avatar_url: user?.avatar_url ?? '',
      email: user?.email ?? ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      const { data: usernameCheckResult } = await checkUsernameAvailability({
        username: values.username
      })

      if (usernameCheckResult !== null) {
        throw new Error('El nombre de usuario ya está en uso.')
      }

      let avatarUrl = values.avatar_url

      if (avatarFile) {
        const { data: avatarUpload, error } = await uploadAvatar(
          avatarFile,
          user?.id ?? ''
        )

        if (error) {
          throw new Error('Error al subir la imagen de perfil')
        }

        const baseURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`
        avatarUrl = avatarUpload?.fullPath
          ? `${baseURL}${avatarUpload.fullPath}`
          : values.avatar_url
        console.log('avatarUrl', avatarUrl)
      }

      await updateUser({
        userData: {
          ...values,
          avatar_url: avatarUrl
        },
        userId: user?.id ?? ''
      })

      toast({
        title: 'Perfil actualizado',
        description: 'Tu perfil ha sido actualizado correctamente'
      })
    } catch (error) {
      toast({
        title: 'Error al actualizar',
        description:
          error instanceof Error
            ? error.message
            : 'Hubo un error al actualizar tu perfil',
        variant: 'destructive'
      })
      console.error(error)
    } finally {
      setIsLoading(false)
      router.refresh()
    }
  }

  return (
    <section className='flex flex-col gap-4 mb-52 px-4 md:mb-0'>
      <Header.Container>
        <Header.Title>Datos Generales del Usuario</Header.Title>
        <Header.Description>
          Actualiza tu información personal y preferencias de idioma.
        </Header.Description>
      </Header.Container>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className=' flex gap-4 items-center'>
            <AvatarDropzone
              imagePreviewInit={user?.avatar_url ?? null}
              onImageDrop={(file) => {
                form.setValue('avatar_url', file.name, { shouldDirty: true })
                setAvatarFile(file)
              }}
            />
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
          </div>

          <FormField
            control={form.control}
            name='full_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input placeholder='Tu nombre completo' {...field} />
                </FormControl>
                <FormDescription>Este es tu nombre completo.</FormDescription>
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
                  <Input placeholder='tu@ejemplo.com' disabled {...field} />
                </FormControl>
                <FormDescription>
                  Tu dirección de correo electrónico principal.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <footer className='flex justify-end'>
            <Button type='submit' disabled={!form.formState.isDirty}>
              {isLoading ? (
                <>
                  <LoaderCircleIcon className='animate-spin size-4 mr-1' />
                  Guardando...
                </>
              ) : (
                <>
                  <SaveIcon className='size-4 mr-1' />
                  Guardar cambios
                </>
              )}
            </Button>
          </footer>
        </form>
      </Form>
    </section>
  )
}
