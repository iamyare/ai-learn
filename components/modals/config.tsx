'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { FolderPlus, Settings } from 'lucide-react'
import { useState, useTransition } from 'react'
import EmojiPicker from '../ui/emoji-picker'
import ColorPicker from '../ui/color-picker'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { insertFolder } from '@/actions'
import { toast } from '../ui/use-toast'

const formSchema = z.object({
  folder_name: z.string().min(1, "El nombre de la carpeta es requerido"),
  folder_icon: z.string().min(1, "Debes seleccionar un emoji"),
  folder_color: z.string().regex(/^#[0-9A-F]{6}$/i, "Debes seleccionar un color válido"),
  user_id: z.string().min(1, "Falta User id"),
})

export default function ConfigModal() {
  const [open, setOpen] = useState(false)
  const [isPeding, startTransition] = useTransition()


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      folder_name: "",
      folder_icon: "🚀",
      folder_color: "#8B00FF",
      user_id: ''
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Aquí puedes manejar la creación de la carpeta
    startTransition(async()=>{
      const {folder, errorFolder} = await insertFolder({folderData: values})

      if (errorFolder){
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
        return
      }

      if (!folder){
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
        return
      }

      // router.push(`${pathname}/${folder.folder_id}`)
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={'icon'} variant={'ghost'}>
          <Settings className='size-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Configuracion</DialogTitle>
          <DialogDescription>
            Configura tu cuenta
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className='flex items-center gap-2'>
              <FormField
                control={form.control}
                name="folder_icon"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <EmojiPicker getValue={field.onChange}>
                        {field.value}
                      </EmojiPicker>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="folder_name"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input placeholder='Nombre de la carpeta' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="folder_color"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ColorPicker getValue={field.onChange} defaultColor={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type='submit'>
                {isPeding ? 'Creando...' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}