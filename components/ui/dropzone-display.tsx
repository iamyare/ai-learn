/* eslint-disable @next/next/no-img-element */
'use client'

import { FileTextIcon, FileXIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export const DropzoneDisplay = {
  Normal: ({ size }: { size: number }) => {
    return (
      <div className='flex flex-col gap-4 w-full'>
        <FileTextIcon
          className='mx-auto size-12 text-muted-foreground opacity-50'
          aria-hidden='true'
        />
        <div className='flex flex-col'>
          <div className='flex justify-center text-sm  text-muted-foreground'>
            <label
              htmlFor='file-upload'
              className='relative flex cursor-pointer  rounded-md  font-semibold text-sec focus-within:outline-none focus-within:ring-2 focus-within:ring-sec focus-within:ring-offset-2 hover:text-sec'
            >
              <span>Subir un archivo</span>
              <input
                id='file-upload'
                name='file-upload'
                type='file'
                className='sr-only'
              />
            </label>
            <p className='ps-1 select-none'>o arrastra y suelta</p>
          </div>
          <p className='text-xs leading-5 text-center text-muted-foreground select-none'>
            Archivos permitido PDF hasta {size}MB
          </p>
        </div>
      </div>
    )
  },
  Accept: () => {
    return (
      <div className='flex flex-col gap-4 w-full'>
        <FileTextIcon
          className='mx-auto size-12 text-primary opacity-50'
          aria-hidden='true'
        />
        <div className='flex flex-col'>
          <p className='text-center text-sm text-primary'>Suelta el archivo</p>
        </div>
      </div>
    )
  },
  Reject: ({ size }: { size: number }) => {
    return (
      <div className='flex flex-col gap-4 w-full'>
        <FileXIcon
          className='mx-auto size-12 text-destructive opacity-50'
          aria-hidden='true'
        />
        <div className='flex flex-col'>
          <p className='text-center text-sm text-destructive'>
            Archivo no permitido
          </p>
          <p className='text-xs text-center leading-5 text-destructive select-none'>
            Archivos permitido PDF hasta {size}MB
          </p>
        </div>
      </div>
    )
  },
  Info: ({ file }: { file: File }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null)

    useEffect(() => {
      let cancel = false

      const renderPDF = async () => {
        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file))
          .promise
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 1.5 })
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (canvas && context) {
          canvas.height = viewport.height
          canvas.width = viewport.width
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          }
          if (!cancel) {
            await page.render(renderContext).promise
            const imageDataUrl = canvas.toDataURL('image/png')
            setImageSrc(imageDataUrl)
          }
        }
      }
      renderPDF()

      return () => {
        cancel = true
      }
    }, [file])

    return (
      <div className='flex flex-col gap-2 w-full overflow-hidden'>
        <div className='flex justify-center h-full w-full bg-top'>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt='PDF preview'
              className='h-full w-full object-cover object-top'
            />
          ) : (
            <p>Cargando...</p>
          )}
        </div>
        <p className='text-center max-w-md truncate'>
          PDF Seleccionado: {file.name}
        </p>
      </div>
    )
  }
}

// Define tus clases de CSS
export const focusedClass = 'bg-primary/5 border-primary text-primary '
export const acceptClass = 'bg-primary/5 border-primary text-primary '
export const rejectClass = 'bg-destructive/5 border-red-500 text-destructive'
