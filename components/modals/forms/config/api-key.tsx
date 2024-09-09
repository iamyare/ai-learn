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
import { useApiKeys } from '@/context/useAPIKeysContext'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { getApiKeys, insertApiKeys, updateApiKeys as updateApiKeysBD } from '@/actions'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

const formSchema = z.object({
  gemini_key: z.string().min(1, 'Gemini Key is required'),
  user_id: z.string().min(1, 'User id is required')
})
export default function ApiKey() {
    const [isPending, startTransition] = useTransition()

    const { apiKeys, updateApiKeys, user_id } = useApiKeys()
    const router = useRouter()
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        gemini_key: apiKeys.gemini_key || '',
        user_id: user_id
      }
    })
  
    function onSubmit(values: z.infer<typeof formSchema>) {
      startTransition(async () => {
        try {
          const { apiKeys, errorApiKeys } = await getApiKeys({ userId: user_id });
  
          if (errorApiKeys) {
            console.error('Error al obtener las claves API:', errorApiKeys);
            return;
          }
  
          if (apiKeys) {
            const { apiKeys: updatedKeys, errorApiKeys: updateError } = await updateApiKeysBD({
              apiKeysData: { gemini_key: values.gemini_key },
              userId: user_id
            });
  
            if (updateError) {
              console.error('Error al actualizar las claves API:', updateError);
              return;
            }
  
            updateApiKeys({ gemini_key: values.gemini_key })
          } else {
            const { apiKeys: newKeys, errorApiKeys: insertError } = await insertApiKeys({
              apiKeysData: { gemini_key: values.gemini_key , user_id: user_id }
            });
  
            if (insertError) {
              console.error('Error al insertar las claves API:', insertError);
              return;
            }
          }
          router.refresh();
        } catch (error) {
          console.error('Error al procesar la solicitud:', error);
        }
      });
    };

  return (
    <section className=' flex flex-col gap-2'>
      <Header.Container>
        <Header.Title>Api Keys</Header.Title>
        <Header.Description>
            Agrega tus claves API para poder realizar operaciones con Inteligencia Artificial.
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
