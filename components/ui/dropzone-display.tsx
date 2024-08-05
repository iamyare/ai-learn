'use client'

import { Image, ImageOff } from 'lucide-react'

export const DropzoneDisplay = {
  Normal: () => {
    return (
      <div className='flex flex-col gap-4 w-full'>
        <Image
          className='mx-auto h-12 w-12 text-muted-foreground opacity-50'
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
          <p className='text-xs leading-5 text-muted-foreground select-none'>
            Archivos permitidos PNG, JPG, WEBP hasta 10MB
          </p>
        </div>
      </div>
    )
  },
  Accept: () => {
    return (
      <div className='flex flex-col gap-4 w-full'>
        <Image
          className='mx-auto h-12 w-12 text-muted-foreground opacity-50'
          aria-hidden='true'
        />
        <div className='flex flex-col'>
          <div className='flex justify-center text-sm  text-muted-foreground'>
            <label
              htmlFor='file-upload'
              className='relative flex cursor-pointer  rounded-md  font-semibold text-sec focus-within:outline-none focus-within:ring-2 focus-within:ring-sec focus-within:ring-offset-2 hover:text-sec'
            >
              <span>Subir sas un archivo</span>
              <input
                id='file-upload'
                name='file-upload'
                type='file'
                className='sr-only'
              />
            </label>
            <p className='ps-1 select-none'>o arrastra y suelta</p>
          </div>
          <p className='text-xs leading-5 text-muted-foreground select-none'>
            Archivos permitidos PNG, JPG, WEBP hasta 10MB
          </p>
        </div>
      </div>
    )
  },
  Reject: () => {
    return (
      <div className='flex flex-col gap-4 w-full h-full bg-red-500'>
        hola
      </div>
    )
  },
  Info: ({ file }: { file: File }) => {
    return (
    <div className='flex flex-col gap-2 w-full'>
    <div className='flex justify-center'>
      <img
        src={URL.createObjectURL(file)}
        alt={`Imagen de ${file.name}`}
        className='h-40 w-40 mt-2 mx-auto rounded-full aspect-square object-cover shadow-lg ring-4 ring-white'
      />
    </div>
    <p className='text-center max-w-md truncate'>Imagen Seleccionada: {file.name}</p>

  </div>
    )
  }
}

// Define tus clases de CSS
export const focusedClass = 'bg-primary/5 border-primary text-primary '
export const acceptClass = 'bg-primary/5 border-primary text-primary '
export const rejectClass =
  'bg-destructive/5 border-red-500 text-destructive'
