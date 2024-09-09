'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GeneralConfig from './general'
import APIConfig from './api-key'
import { Separator } from '@/components/ui/separator'
import AudioConfig from './audio-config'

export default function TabsConf() {
  return (
    <Tabs
      defaultValue='account'
      className=' flex flex-col md:flex-row w-full h-full gap-2'
    >
      <TabsList className=' flex md:flex-col h-full bg-transparent md:justify-start items-start'>
        <TabsTrigger className=' w-full md:justify-start ' value='account'>
          Cuenta
        </TabsTrigger>
        <TabsTrigger className=' w-full md:justify-start' value='api'>
          API
        </TabsTrigger>
        <TabsTrigger className=' w-full md:justify-start' value='audio'>
          Audio
        </TabsTrigger>
        <TabsTrigger className=' w-full md:justify-start' value='sessions'>
          Sesiones
        </TabsTrigger>
        <TabsTrigger className=' w-full md:justify-start' value='delete'>
          Eliminar cuenta
        </TabsTrigger>
      </TabsList>
      <Separator orientation='vertical' />
      <div className=' w-full px-4'>
        <TabsContent className=' w-full' value='account'>
          <GeneralConfig />
        </TabsContent>
        <TabsContent className=' w-full' value='api'>
          <APIConfig />
        </TabsContent>
        <TabsContent value='audio'>
          <AudioConfig />
        </TabsContent>
        <TabsContent value='sessions'>
          <div className='text-muted-foreground'>
            Luego se mostraran las sesiones
          </div>
        </TabsContent>
        <TabsContent value='delete'>
          <div className='text-muted-foreground'>
            Luego se mostrara la opcion de eliminar cuenta
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )
}