'use client'

import { useEffect } from 'react'
import { FileTextIcon, FileXIcon } from 'lucide-react'
import { Document, Page } from 'react-pdf'
import { configurePdfWorker } from '@/lib/pdf-worker'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Configura el worker de PDF.js
configurePdfWorker()

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
    return (
      <div className='flex flex-col gap-2 w-full overflow-hidden'>
        <Document file={file} className="w-full h-full">
          <Page 
            pageNumber={1} 
            width={300}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
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
