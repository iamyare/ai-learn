'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GeneralConfig from './general'
import APIConfig from './api-key'
import { Separator } from '@/components/ui/separator'
import AudioConfig from './audio-config'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function TabsConf() {
  return (
    <Tabs
      defaultValue='account'
      className=' flex flex-col md:flex-row w-full h-full overflow-hidden gap-2'
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
      <ScrollArea className=' w-full h-full overflow-y-auto'>
        <div className=' w-full px-4  overflow-y-auto'>
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
      </ScrollArea>
    </Tabs>
  )
}
