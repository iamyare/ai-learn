import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import SettingsSidebar from './SettingsSidebar'
import SettingsContent from './SettingsContent'
import { useMediaQuery } from '../ui/use-media-query'

export function SettingsDialog({
  open,
  onOpenChange
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [activeTab, setActiveTab] = React.useState('Cuenta')
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button size='sm'>Abrir Configuración</Button>
        </DialogTrigger>
        <DialogContent className='overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]'>
          <DialogHeader>
            <DialogTitle className='sr-only'>Configuración</DialogTitle>
            <DialogDescription className='sr-only'>
              Personaliza tu configuración aquí.
            </DialogDescription>
          </DialogHeader>
          <div className='flex'>
            <SettingsSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <SettingsContent activeTab={activeTab} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button size='sm'>Abrir Configuración</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Configuración</DrawerTitle>
          <DrawerDescription>
            Personaliza tu configuración aquí.
          </DrawerDescription>
        </DrawerHeader>
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SettingsContent activeTab={activeTab} className='px-4' />
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
