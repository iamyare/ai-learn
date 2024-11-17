import * as React from 'react'
import GeneralConfig from './forms/config/general'
import APIConfig from './forms/config/api-key'
import AudioConfig from './forms/config/audio-config'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import UserSessions from './forms/config/sessions'

export default function SettingsContent({
  activeTab,
  className
}: {
  activeTab: string
  className?: string
}) {
  return (
    <ScrollArea
      className={cn(
        'flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0',
        className
      )}
    >
      {activeTab === 'Cuenta' && <GeneralConfig />}
      {activeTab === 'API' && <APIConfig />}
      {activeTab === 'Audio' && <AudioConfig />}
      {activeTab === 'Sesiones' && <UserSessions />}
      {activeTab === 'Eliminar cuenta' && (
        <div className='text-muted-foreground'>
          Luego se mostrará la opción de eliminar cuenta
        </div>
      )}
    </ScrollArea>
  )
}
