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
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/context/useUserContext'

const formSchema = z.object({
  session_name: z.string().min(1, 'Session Name is required'),
  user_id: z.string().min(1, 'User id is required')
})

export default function UserSessions() {
  const [isPending, startTransition] = useTransition()
  const { user } = useUser()

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      session_name: '',
      user_id: user?.id || ''
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        // Aquí iría la lógica para manejar las sesiones del usuario
        console.log('Session data:', values)
        router.refresh()
      } catch (error) {
        console.error('Error al procesar la solicitud:', error)
      }
    })
  }

  return (
    <section className=' flex flex-col gap-2'>
      <Header.Container>
        <Header.Title>User Sessions</Header.Title>
        <Header.Description>
          Aquí puedes ver y gestionar tus sesiones.
        </Header.Description>
      </Header.Container>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-2 space-y-4'>
          <FormField
            control={form.control}
            name='session_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Name</FormLabel>
                <FormControl>
                  <Input placeholder='Session Name' {...field} />
                </FormControl>
                <FormDescription>
                  Ingresa el nombre de la sesión que deseas gestionar.
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
