'use client'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import TabsConf from './forms/config/tabs-config'



export default function ConfigModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=''>

        <TabsConf  />
      </DialogContent>
    </Dialog>
  )
}