import React from 'react'
import { MusicIcon, XCircleIcon } from 'lucide-react'

interface StyledIconProps {
  type: 'accept' | 'preview' | 'normal' | 'reject'
}

const iconStyles = {
  base: 'mx-auto size-10 rounded-full',
  accept: 'text-primary opacity-50',
  preview: 'text-muted-foreground opacity-50',
  normal: 'text-muted-foreground opacity-50',
  reject: 'text-destructive opacity-50'
}

export const StyledIcon = ({ type }: StyledIconProps) => {
  const className = `${iconStyles.base} ${iconStyles[type]}`

  switch (type) {
    case 'accept':
      return <MusicIcon className={className} aria-hidden='true' />
    case 'preview':
      return <MusicIcon className={className} aria-hidden='true' />
    case 'normal':
      return <MusicIcon className={className} aria-hidden='true' />
    case 'reject':
      return <XCircleIcon className={className} aria-hidden='true' />
    default:
      return null
  }
}

export const DropzoneDisplay = {
  Normal: () => {
    return (
      <div className='flex flex-col gap-4 w-full'>
        <StyledIcon type='normal' />
        <div className='flex flex-col'>
          <div className='flex justify-center text-sm text-muted-foreground'>
            <label
              htmlFor='file-upload'
              className='relative flex cursor-pointer rounded-md font-semibold text-sec focus-within:outline-none focus-within:ring-2 focus-within:ring-sec focus-within:ring-offset-2 hover:text-sec'
            >
              <span>Subir un archivo de audio</span>
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
            Archivos permitidos: MP3, WAV, OGG, M4A hasta 10MB
          </p>
        </div>
      </div>
    )
  },
  Accept: () => {
    return (
      <div className='flex flex-col gap-4 w-full'>
        <StyledIcon type='accept' />
        <div className='flex flex-col'>
          <p className='text-center text-sm text-primary'>Suelta el archivo</p>
          <p className='text-xs text-center leading-5 text-primary select-none'>
            Archivos permitidos: MP3, WAV, OGG, M4A hasta 10MB
          </p>
        </div>
      </div>
    )
  },
  Reject: () => {
    return (
      <div className='flex flex-col gap-4 w-full'>
        <StyledIcon type='reject' />
        <div className='flex flex-col'>
          <p className='text-center text-sm text-destructive'>
            Archivo no permitido
          </p>
          <p className='text-xs text-center leading-5 text-destructive select-none'>
            Archivos permitidos: MP3, WAV, OGG, M4A hasta 10MB
          </p>
        </div>
      </div>
    )
  }
  // El resto del código permanece igual
}
