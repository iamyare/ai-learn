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
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { FilePlus2, LoaderCircle } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
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
import { insertNotebook, insertPdfDocument } from '@/actions'
import { toast } from '../ui/use-toast'
import { usePathname, useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import {
  acceptClass,
  DropzoneDisplay,
  focusedClass,
  rejectClass
} from '../ui/dropzone-display'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { useFolderNavigationStore } from '@/stores/useFolderNavigationStore'
import { useUserStore } from '@/stores/useUserStore'
import { usePdfUploadEnable } from '@/hooks/use-pdf-upload-enable'
import { useUploadPdf } from '@/hooks/use-upload-pdf'

const ACCEPTED_FILE_TYPES = ['application/pdf']

export default function CreateNotebook({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  const { user, setCountPdf, countPdf } = useUserStore()

  const MAX_PDF_SIZE = user?.user_subscription.subscription.max_pdf_size ?? 10

  const MAX_FILE_SIZE = MAX_PDF_SIZE * 1024 * 1024 // 10MB

  const formSchema = z.object({
    notebook_name: z.string().min(1, 'El nombre del notebook es requerido'),
    folder_id: z.string().nullable(),
    user_id: z.string().min(1, 'Falta User id'),
    file: z
      .custom<File>((value) => value instanceof File, {
        message: 'Se requiere un archivo PDF'
      })
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        `El tamaño máximo del archivo es ${MAX_PDF_SIZE}MB.`
      )
      .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file.type),
        'Solo se permiten archivos PDF'
      )
  })

  const { currentPath } = useFolderNavigationStore()

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

  const uploadPdfMutation = useUploadPdf()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { file, ...notebookData } = values

    try {
      // Usar la mutación de react-query para subir el archivo
      const uploadResult = await uploadPdfMutation.mutateAsync({
        file,
        userId
      })

      // Crear notebook
      const { notebook, errorNotebook } = await insertNotebook({
        notebookData
      })

      if (errorNotebook) throw new Error(errorNotebook.message)

        if (!notebook) throw new Error('Error al crear el notebook')

      // Crear documento PDF
      const { pdfDocument, errorPdfDocument } = await insertPdfDocument({
        pdfData: {
          notebook_id: notebook.notebook_id,
          file_path: uploadResult.url,
          file_name: file.name,
          file_size: String(file.size)
        }
      })

      if (errorPdfDocument) throw new Error(errorPdfDocument.message)

      setCountPdf(countPdf + 1)
      router.push(`${pathname}/${notebook.notebook_id}`)
      setOpen(false)

      toast({
        title: 'Notebook creado con éxito',
        description: `Se ha creado el notebook "${values.notebook_name}"`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive'
      })
    }
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
      'h-52 w-full flex text-muted-foreground flex-col justify-center items-center rounded-lg border border-dashed border-muted-foreground/25 overflow-hidden '
    className += getClassName()
    return className
  }

  const isEnable = usePdfUploadEnable()

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
          <form
            onSubmit={
              isEnable
                ? form.handleSubmit(onSubmit)
                : (e) => {
                    e.preventDefault()
                  }
            }
            className={cn(' w-full p-1 overflow-hidden space-y-4 relative')}
          >
            {isEnable ? null : (
              <div className=' absolute top-0 left-0 inset-0 flex backdrop-blur-[2px] z-50'>
                <div className=' flex flex-col items-center justify-center gap-2 p-4'>
                  <p className=' text-lg text-center font-medium'>
                    Has alcanzado el límite de subida de PDF
                  </p>
                  <Button
                    onClick={() => {
                      router.push('/settings/subscription')
                    }}
                  >
                    Actualizar plan
                  </Button>
                </div>
              </div>
            )}

            <div
              className={cn(
                'flex flex-col w-full items-center gap-2',
                isEnable ? '' : 'pointer-events-none opacity-50 grayscale'
              )}
            >
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
                  <FormItem className='w-full '>
                    <FormLabel>Archivo PDF</FormLabel>
                    <FormControl>
                      <div
                        {...getRootProps()}
                        className={cn(
                          getDropzoneClassName(),
                          isPending ? 'animate-pulse duration-1000' : ' '
                        )}
                      >
                        <input {...getInputProps({ onChange, onBlur, ref })} />
                        {value ? (
                          <DropzoneDisplay.Info file={value} />
                        ) : (
                          <>
                            {isDragAccept && (
                              <motion.div
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                  type: 'spring',
                                  stiffness: 260,
                                  damping: 50
                                }}
                              >
                                <DropzoneDisplay.Accept />
                              </motion.div>
                            )}
                            {isDragReject && (
                              <motion.div
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                  type: 'spring',
                                  stiffness: 260,
                                  damping: 50
                                }}
                              >
                                <DropzoneDisplay.Reject size={MAX_PDF_SIZE} />
                              </motion.div>
                            )}
                            {!isDragActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: 'spring',
                                  stiffness: 260,
                                  damping: 20
                                }}
                              >
                                <DropzoneDisplay.Normal size={MAX_PDF_SIZE} />
                              </motion.div>
                            )}
                          </>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage>{error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter
              className={cn(isEnable ? '' : 'pointer-events-none opacity-50 ')}
            >
              <Button type='submit'>
                {isPending ? (
                  <>
                    <LoaderCircle className='size-4 mr-2 animate-spin' />
                    Creando Notebook
                  </>
                ) : (
                  <>
                    <FilePlus2 className='size-4 mr-2' />
                    Crear Notebook
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
