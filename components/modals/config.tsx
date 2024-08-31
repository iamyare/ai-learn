'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
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
import { getApiKeys, insertApiKeys, updateApiKeys as updateApiKeysBD } from '@/actions'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  gemini_key: z.string().min(1, 'Gemini Key is required'),
  user_id: z.string().min(1, 'User id is required')
})

export default function ConfigModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
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

        onOpenChange(false);
        router.refresh();
      } catch (error) {
        console.error('Error al procesar la solicitud:', error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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