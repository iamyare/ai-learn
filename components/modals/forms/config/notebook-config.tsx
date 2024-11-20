import React, { useEffect, useState } from 'react'
import { Header } from '../header'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { SaveIcon, Volume2Icon } from 'lucide-react'
import useTextToSpeech from '@/components/ui/useTextToSpeech'

const STORAGE_KEY = 'notebook_config'

const browsers = [
  { value: 'chrome', label: 'Google Chrome' },
  { value: 'firefox', label: 'Firefox' },
  { value: 'safari', label: 'Safari' }
]

const voicesByBrowser = {
  chrome: [
    { value: 'google-es-es', label: 'Google Español (Natural)' },
    { value: 'google-us-en', label: 'Google English US (Natural)' },
    { value: 'microsoft-helena', label: 'Microsoft Helena' }
  ],
  firefox: [
    { value: 'native-es', label: 'Español (Nativo)' },
    { value: 'native-en', label: 'English (Native)' }
  ],
  safari: [
    { value: 'samantha', label: 'Samantha (English)' },
    { value: 'juan', label: 'Juan (Español)' },
    { value: 'monica', label: 'Monica (Español)' }
  ]
}

const formSchema = z.object({
  defaultLanguage: z.string({
    required_error: 'Por favor selecciona un idioma'
  }),
  autoSave: z.boolean().default(true),
  browser: z.string({
    required_error: 'Por favor selecciona un navegador'
  }),
  voiceType: z.string({
    required_error: 'Por favor selecciona una voz'
  })
})

const languages = [
  { value: 'es-MX', label: 'Español Latinoamerica' },
  { value: 'es-ES', label: 'Español Castellano' },
  { value: 'en', label: 'Inglés' },
  { value: 'fr', label: 'Francés' },
  { value: 'de', label: 'Alemán' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Portugués' }
]

export default function NotebookConfig() {
  const [selectedBrowser, setSelectedBrowser] = useState('chrome')
  const [isPlaying, setIsPlaying] = useState(false)

  const { getVoices, speak } = useTextToSpeech({
    text: 'Hola, esta es una prueba de voz.'
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored
        ? JSON.parse(stored)
        : {
            defaultLanguage: 'es',
            autoSave: true,
            browser: 'chrome',
            voiceType: 'google-es-es'
          }
    }
  })

  const previewVoice = () => {
    setIsPlaying(true)
    const language = form.getValues('defaultLanguage')
    const testText = {
      es: 'Hola, esta es una prueba de voz.',
      en: 'Hi, this is a voice test.',
      fr: 'Bonjour, ceci est un test vocal.',
      de: 'Hallo, dies ist ein Sprachtest.',
      it: 'Ciao, questo è un test vocale.',
      pt: 'Olá, este é um teste de voz.'
    }[language]

    speak(1)
    setIsPlaying(false)
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
    console.log('Notebook configuration saved:', values)
  }

  return (
    <section className='flex flex-col gap-4 px-4 mb-52 md:mb-0'>
      <Header.Container>
        <Header.Title>Configuración del Notebook</Header.Title>
        <Header.Description>
          Personaliza las opciones predeterminadas para tus notebooks.
        </Header.Description>
      </Header.Container>
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='defaultLanguage'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idioma predeterminado</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona un idioma' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Este será el idioma predeterminado para nuevos notebooks.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='voiceType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voz para lectura</FormLabel>
                <div className='flex gap-2'>
                  <Select
                    disabled
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='flex-1'>
                        <SelectValue placeholder='Selecciona una voz' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {voicesByBrowser[
                        selectedBrowser as keyof typeof voicesByBrowser
                      ].map((voice) => (
                        <SelectItem key={voice.value} value={voice.value}>
                          {voice.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    disabled
                    onClick={previewVoice}
                  >
                    <Volume2Icon className='size-4' />
                  </Button>
                </div>
                <FormDescription>
                  Selecciona la voz que se utilizará para la lectura del
                  contenido.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='autoSave'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between '>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>Autoguardado</FormLabel>
                  <FormDescription>
                    Guardar automáticamente los cambios del notebook
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <footer className='flex justify-end'>
            <Button type='submit' disabled={!form.formState.isDirty}>
              <SaveIcon className='size-4 mr-1' />
              Guardar cambios
            </Button>
          </footer>
        </form>
      </Form>
    </section>
  )
}
