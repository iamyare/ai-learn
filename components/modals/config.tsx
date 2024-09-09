'use client'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import TabsConf from './forms/config/tabs-config'



export default function ConfigModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=' h-[620px] max-w-xl overflow-hidden'>

        <TabsConf  />
      </DialogContent>
    </Dialog>
  )
}