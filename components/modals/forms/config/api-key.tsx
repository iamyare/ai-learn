import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Header } from '../header'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  getApiKeys,
  insertApiKeys,
  updateApiKeys as updateApiKeysBD
} from '@/actions'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { useApiKeysStore } from '@/stores/useApiKeysStore'
import { useToast } from '@/components/ui/use-toast'

const formSchema = z.object({
  gemini_key: z.string().min(1, 'Gemini Key es requerido'),
  user_id: z.string().min(1, 'User id es requerido')
})

export default function ApiKey() {
  const [isPending, startTransition] = useTransition()
  const { apiKeys, updateApiKeys, userId } = useApiKeysStore()
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gemini_key: apiKeys.gemini_key || '',
      user_id: userId
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const { apiKeys, errorApiKeys } = await getApiKeys({ userId: userId })

        if (errorApiKeys) {
          toast({
            title: 'Error al obtener las claves API',
            description: 'Hubo un error al obtener las claves API',
            variant: 'destructive'
          })
          return
        }

        if (apiKeys) {
          const { errorApiKeys: updateError } = await updateApiKeysBD({
            apiKeysData: { gemini_key: values.gemini_key },
            userId: userId
          })

          if (updateError) {
            toast({
              title: 'Error al actualizar las claves API',
              description: 'Hubo un error al actualizar las claves API',
              variant: 'destructive'
            })
            return
          }

          updateApiKeys({ gemini_key: values.gemini_key })
          toast({
            title: 'Claves API actualizadas',
            description: 'Tus claves API han sido actualizadas correctamente'
          })
        } else {
          const { errorApiKeys: insertError } = await insertApiKeys({
            apiKeysData: { gemini_key: values.gemini_key, user_id: userId }
          })

          if (insertError) {
            toast({
              title: 'Error al guardar las claves API',
              description: 'Hubo un error al guardar las claves API',
              variant: 'destructive'
            })
            return
          }

          toast({
            title: 'Claves API insertadas',
            description: 'Tus claves API han sido insertadas correctamente'
          })
        }
        router.refresh()
      } catch (error) {
        toast({
          title: 'Error al procesar la solicitud',
          description:
            error instanceof Error
              ? error.message
              : 'Hubo un error al procesar tu solicitud',
          variant: 'destructive'
        })
        console.error('Error al procesar la solicitud:', error)
      }
    })
  }

  return (
    <section className=' flex flex-col gap-2 px-4 mb-52 md:mb-0'>
      <Header.Container>
        <Header.Title>Api Keys</Header.Title>
        <Header.Description>
          Agrega tus claves API para poder realizar operaciones con Inteligencia
          Artificial.
        </Header.Description>
      </Header.Container>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-2 space-y-4'>
          <FormField
            control={form.control}
            name='gemini_key'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Api Key Gemini</FormLabel>
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
                    href='https://makersuite.google.com/app/apikey?hl=es-419'
                    className=' underline'
                    target='_blank'
                  >
                    aquí
                  </Link>
                  .
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <footer className=' flex justify-end'>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </footer>
        </form>
      </Form>
    </section>
  )
}
