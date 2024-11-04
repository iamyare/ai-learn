/* eslint-disable @next/next/no-img-element */
'use client'

import {
  MusicIcon,
  RefreshCcw,
  Sparkles,
  Trash,
  XCircleIcon,
  XIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './button'
import { DialogEntry } from '@/types/speechRecognition'
import { transcribeAudio } from '@/lib/ai/ai-transcribe'

export const DropzoneDisplay = {
  Normal: () => {
    return (
      <div className='flex flex-col gap-4 w-full'>
        <MusicIcon
          className='mx-auto size-12 text-muted-foreground opacity-50'
          aria-hidden='true'
        />
        <div className='flex flex-col'>
          <div className='flex justify-center text-sm  text-muted-foreground'>
            <label
              htmlFor='file-upload'
              className='relative flex cursor-pointer  rounded-md  font-semibold text-sec focus-within:outline-none focus-within:ring-2 focus-within:ring-sec focus-within:ring-offset-2 hover:text-sec'
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
            Archivos permitidos: MP3, WAV, OGG hasta 10MB
          </p>
        </div>
      </div>
    )
  },
  Accept: () => {
    return (
      <div className='flex flex-col gap-4 w-full'>
        <MusicIcon
          className='mx-auto size-12 text-primary opacity-50'
          aria-hidden='true'
        />
        <div className='flex flex-col'>
          <p className='text-center text-sm text-primary'>Suelta el archivo</p>
          <p className='text-xs text-center leading-5 text-primary select-none'>
            Archivos permitidos: MP3, WAV, OGG hasta 10MB
          </p>
        </div>
      </div>
    )
  },
  Reject: () => {
    return (
      <div className='flex flex-col gap-4 w-full'>
        <XCircleIcon
          className='mx-auto size-12 text-destructive opacity-50'
          aria-hidden='true'
        />
        <div className='flex flex-col'>
          <p className='text-center text-sm text-destructive'>
            Archivo no permitido
          </p>
          <p className='text-xs text-center leading-5 text-destructive select-none'>
            Archivos permitidos: MP3, WAV, OGG hasta 10MB
          </p>
        </div>
      </div>
    )
  },
  Info: ({
    file,
    onDelete,
    onTranscriptionComplete,
    isPendingTranscription,
    startTransitionTranscription,
    hiddenComponent
  }: {
    file: File
    onDelete?: () => void
    onTranscriptionComplete?: (transcription: DialogEntry[]) => void
    isPendingTranscription: boolean
    startTransitionTranscription: (isPendingTranscription: boolean) => void
    hiddenComponent: () => void
  }) => {
    const [audioSrc, setAudioSrc] = useState<string | null>(null)

    useEffect(() => {
      const objectUrl = URL.createObjectURL(file)
      setAudioSrc(objectUrl)

      return () => {
        URL.revokeObjectURL(objectUrl)
      }
    }, [file])

    const handleTranscribe = async (e: React.MouseEvent) => {
      e.stopPropagation()

      startTransitionTranscription(true)
      hiddenComponent()

      try {
        const result = await transcribeAudio({
          audioFile: file,
          apiKey: 'AIzaSyAeIyoeiEyba6Ss2e_y5_MfsFKGJRIjpOM'
        })

        onTranscriptionComplete?.(result)
        startTransitionTranscription(false)
      } catch (error) {
        console.error('Error al transcribir el audio:', error)
        startTransitionTranscription(false)
      }
    }

    if (isPendingTranscription) return null

    return (
      <div className='flex flex-col gap-2 w-full overflow-hidden relative'>
        <div className='flex justify-center h-full w-full bg-top'>
          {audioSrc ? (
            <audio
              controls
              className='w-full'
              onClick={(e) => e.stopPropagation()}
            >
              <source src={audioSrc} type={file.type} />
              Tu navegador no soporta la reproducción de audio.
            </audio>
          ) : (
            <p>Cargando...</p>
          )}
        </div>
        <p className='text-center max-w-md truncate'>
          Archivo de audio seleccionado: {file.name}
        </p>
        <footer className='flex gap-2 items-center'>
          <Button
            variant='ghost'
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.()
            }}
            size={'icon'}
            className=' aspect-square text-destructive hover:text-destructive hover:bg-destructive/10'
          >
            <Trash className='size-4' />
          </Button>
          <Button
            variant='ghost'
            onClick={(e) => {
              setAudioSrc(null)
            }}
          >
            <RefreshCcw className='size-4 mr-2' />
            Cambiar archivo
          </Button>

          <Button className='w-full' onClick={handleTranscribe}>
            <Sparkles className='size-4 mr-2' />
            Transcribir Audio
          </Button>
        </footer>
      </div>
    )
  }
}

// Define tus clases de CSS
export const focusedClassAudio =
  'bg-primary/5 backdrop-blur-sm border-primary text-primary '
export const acceptClassAudio =
  'bg-primary/5 backdrop-blur-sm border-primary text-primary '
export const rejectClassAudio =
  'bg-destructive/5 backdrop-blur-sm border-red-500 text-destructive'
export const normalClassAudio =
  'bg-muted/10 backdrop-blur-sm border-foreground/10 text-foreground'
