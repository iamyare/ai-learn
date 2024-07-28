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
import { FilePlus2, FolderPlus } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import EmojiPicker from '../ui/emoji-picker'
import ColorPicker from '../ui/color-picker'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { insertFolder, insertNotebook, insertPdfDocument, uploadPdfToStorage } from '@/actions'
import { toast } from '../ui/use-toast'
import { useFolderNavigation } from '@/context/useFolderNavigationContext'
import { usePathname, useRouter } from 'next/navigation'
import DragAndDrop from '../ui/dragAndDrop'
import { DropzoneState, useDropzone } from 'react-dropzone'
import {
  acceptClass,
  DropzoneDisplay,
  focusedClass,
  rejectClass
} from '../ui/dropzone-display'
import { supabase } from '@/lib/supabase'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf'
]

const formSchema = z.object({
  notebook_name: z.string().min(1, 'El nombre del notebook es requerido'),
  folder_id: z.string().nullable(),
  user_id: z.string().min(1, 'Falta User id'),
  file: z
    .custom<File>((value) => value instanceof File, {
      message: "Se requiere un archivo PDF"
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, `El tamaño máximo del archivo es 10MB.`)
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      'Solo se permiten archivos PDF'
    )
})

export default function CreateNotebook({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const [isPeding, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  const { currentPath } = useFolderNavigation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notebook_name: '',
      folder_id: null,
      user_id: userId,
      file: undefined
    }
  })

  useEffect(() => {
    const parentFolderId =
      currentPath.length > 1 ? currentPath[currentPath.length - 1].id : null

    form.setValue('folder_id', parentFolderId)
  }, [currentPath, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: "Notebook creado",
      description: `Nombre: ${values.notebook_name}, Archivo: ${values.file?.name || 'No seleccionado'}`,
    })


    const { file, ...notebookData } = values;

    startTransition(async()=>{


      const { data: uploadResult, error:errorUploadResult } = await supabase.storage
      .from('pdf_documents')
      .upload(`${file.name}.pdf`, file)

      console.log('uploadResult', uploadResult, errorUploadResult)

      if (errorUploadResult){
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
        return
      }

      if (!uploadResult){
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
        return
      }

      const { notebook, errorNotebook } = await insertNotebook({notebookData})

      console.log('notebook', notebook, errorNotebook)

      if (errorNotebook){
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
        return
      }

      if (!notebook){
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
        return
      }




      const baseURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`;
      const fullPath = `${baseURL}${uploadResult.fullPath}`;


      const {pdfDocument, errorPdfDocument} = await insertPdfDocument({ pdfData:{
        notebook_id: notebook.notebook_id,
        file_path: fullPath,
        file_name: file.name,
        file_size: String(file.size),
      }})

      console.log('pdfDocument', pdfDocument, errorPdfDocument)

      if (errorPdfDocument){
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
        return
      }

      if (!pdfDocument){
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
        return
      }

      router.push(`${pathname}/${notebook.notebook_id}`)
      setOpen(false)
    })
  }

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      form.setValue('file', acceptedFiles[0], { shouldValidate: true })
    }
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    isFocused
  } = useDropzone({
    onDrop,
    accept: {
        'application/pdf': ['.pdf']
    },
    multiple: false,
    maxSize: MAX_FILE_SIZE
  })

  const getClassName = () => {
    if (isDragReject) return rejectClass
    if (isDragAccept) return acceptClass
    if (isFocused) return focusedClass
    return ''
  }

  const getDropzoneClassName = () => {
    let className = 'transition-all duration-300 ease-in-out '
    className +=
      'h-52 w-full flex text-muted-foreground flex-col justify-center items-center rounded-lg border border-dashed border-muted-foreground/25 p-4 '
    className += getClassName()
    return className
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'outline'}>
          <FilePlus2 className='size-4 mr-2' />
          <span>Notebook</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Crear un notebook</DialogTitle>
          <DialogDescription>
            Un notebook es un contenedor para tus notas
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='flex flex-col w-full  items-center gap-2'>
              <FormField
                control={form.control}
                name='notebook_name'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Nombre del notebook</FormLabel>
                    <FormControl>
                      <Input placeholder='Notebook...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
<Controller
                name='file'
                control={form.control}
                render={({
                  field: { onChange, onBlur, value, ref },
                  fieldState: { error }
                }) => (
                  <FormItem className='w-full z-[1000]'>
                    <FormLabel>Archivo PDF</FormLabel>
                    <FormControl>
                      <div
                        {...getRootProps()}
                        className={getDropzoneClassName()}
                      >
                        <input {...getInputProps({ onChange, onBlur, ref })} />
                        {value ? (
                          <DropzoneDisplay.Info file={value} />
                        ) : (
                          <>
                            {!isDragActive && <DropzoneDisplay.Normal />}
                            {isDragAccept && <DropzoneDisplay.Accept />}
                            {isDragReject && <DropzoneDisplay.Reject />}
                          </>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage>{error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type='submit'>{isPeding ? 'Creando...' : 'Crear'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
