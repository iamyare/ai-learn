import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useTransition
} from 'react'
import { Button } from '@/components/ui/button'
import { CoursorText } from '@/components/ui/coursor-text'
import { useSpeechRecognitionContext } from '@/context/useSpeechRecognitionContext'
import { cn, formatDate } from '@/lib/utils'
import {
  Mic,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Cloudy,
  CloudOff,
  StopCircle
} from 'lucide-react'
import {
  getTranscriptions,
  createTranscriptNotebook,
  updateTranscriptNotebook
} from '@/actions'
import { TranscriptionSkeleton } from '@/components/skeletons'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { MoreOptionsTranscript } from './more-options'
import useTextToSpeech from '@/components/ui/useTextToSpeech'

interface SpeechRecognitionProps {
  classNameContainer?: string
  classNameHeader?: string
  classNameTranscript?: string
  notebookId: string
}

export default function SpeechRecognition({
  classNameContainer,
  classNameHeader,
  classNameTranscript,
  notebookId
}: SpeechRecognitionProps) {
  const {
    isListening,
    transcript,
    history,
    startListening,
    stopListening,
    updateOptions
  } = useSpeechRecognitionContext()

  const [isPending, startTransition] = useTransition()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdated, setIsUpdated] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null)

  const fullText = history.map(entry => entry.text).join(' ') + ' ' + transcript
  const { speak, pause, stop, isPlaying, currentPosition } = useTextToSpeech({ text: fullText })

  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [shouldAutoScroll])

  useEffect(() => {
    scrollToBottom()
  }, [history, transcript, scrollToBottom])

  useEffect(() => {
    const loadTranscriptions = async () => {
      setIsLoading(true)
      try {
        const { transcriptions, errorTranscriptions } = await getTranscriptions(
          { notebookId }
        )
        if (transcriptions && transcriptions.content) {
          const parsedContent = JSON.parse(String(transcriptions.content))
          updateOptions({ history: parsedContent })
          setIsUpdated(true)
          setLastUpdateTime(new Date(transcriptions.updated_at))
        } else if (errorTranscriptions) {
          console.error('Error al cargar transcripciones:', errorTranscriptions)
          setIsUpdated(false)
        }
      } catch (error) {
        console.error('Error al cargar transcripciones:', error)
        setIsUpdated(false)
      } finally {
        setIsLoading(false)
      }
    }
    loadTranscriptions()
  }, [notebookId, updateOptions])

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
      const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 10
      setShouldAutoScroll(isScrolledToBottom)
    }
  }

  const handleAction = async () => {
    startTransition(async () => {
      if (isListening) {
        stopListening()
      } else {
        startListening()
      }

      try {
        console.log('Iniciando actualización de transcripciones...')
        const { transcriptions } = await getTranscriptions({ notebookId })
        if (transcriptions) {
          await updateTranscriptNotebook({
            transcriptHistory: history,
            notebookId
          })
        } else {
          await createTranscriptNotebook({
            transcriptHistory: history,
            notebookId
          })
        }
        console.log('Transcripciones guardadas, verificando actualización...')

        const { transcriptions: updatedTranscriptions } =
          await getTranscriptions({ notebookId })
        if (updatedTranscriptions && updatedTranscriptions.content) {
          const parsedContent = JSON.parse(
            String(updatedTranscriptions.content)
          )

          if (JSON.stringify(parsedContent) === JSON.stringify(history)) {
            console.log('Contenido actualizado correctamente')
            setIsUpdated(true)
            setLastUpdateTime(new Date(updatedTranscriptions.updated_at))
          } else {
            console.log('El contenido no coincide con el history actual')
            setIsUpdated(false)
          }
        } else {
          console.log('No se encontraron transcripciones actualizadas')
          setIsUpdated(false)
        }
      } catch (error) {
        console.error('Error al actualizar transcripciones:', error)
        setIsUpdated(false)
      }
    })
  }

  const handleTTSAction = () => {
    if (isPlaying) {
      pause()
    } else {
      speak()
    }
  }

  return (
    <section className={cn('flex flex-col h-full w-full', classNameContainer)}>
      <TooltipProvider>
        <header
          className={cn(
            'flex justify-between items-center p-2 w-full',
            classNameHeader
          )}
        >
          <span></span>

          <div className='flex gap-2 items-center'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size={'icon'} variant={'ghost'}>
                  <SkipBack className='size-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>No disponible</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size={'icon'} 
                  variant={'ghost'}
                  onClick={handleTTSAction}
                >
                  {isPlaying ? (
                    <Pause className='size-4' />
                  ) : (
                    <Play className='size-4' />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isPlaying ? 'Pausar lectura' : 'Iniciar lectura'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={'icon'}
                  variant={'ghost'}
                  onClick={handleAction}
                  disabled={isPending}
                >
                  {isListening ? (
                    <Mic className='size-4 text-red-500' />
                  ) : (
                    <Mic className='size-4' />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Presiona para comenzar a transcribir</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size={'icon'} 
                  variant={'ghost'}
                  onClick={stop}
                >
                  <StopCircle className='size-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Detener lectura</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size={'icon'} variant={'ghost'}>
                  <SkipForward className='size-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>No disponible</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className='flex items-center gap-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                {isUpdated ? (
                  <Cloudy className='size-4 text-muted-foreground' />
                ) : (
                  <CloudOff className='size-4 text-muted-foreground' />
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isUpdated
                    ? `Última actualización: ${formatDate(
                        lastUpdateTime || new Date()
                      )}`
                    : 'No hay actualizaciones o error al guardar'}
                </p>
              </TooltipContent>
            </Tooltip>

            <MoreOptionsTranscript />
          </div>
        </header>
      </TooltipProvider>

      <aside
        className={cn(
          'w-full h-full px-4 overflow-y-auto transcript-scroll-area',
          classNameTranscript
        )}
        ref={scrollAreaRef}
        onScroll={handleScroll}
      >
        {isLoading ? (
          <TranscriptionSkeleton />
        ) : history.length !== 0 ? (
          <ul className='space-y-1'>
            {history.map((entry, index) => (
              <li key={index} className='flex flex-col'>
                <span className='ml-2 text-muted-foreground text-sm'>
                  [{formatDate(entry.timestamp || new Date(), 'datetime')}] -
                  Página {entry.page || 'Unknown'}
                </span>
                <p>
                  {entry.text.split('').map((char, charIndex) => (
                    <span
                      key={charIndex}
                      className={cn(
                        charIndex < currentPosition ? 'bg-yellow-200 dark:bg-yellow-800' : ''
                      )}
                    >
                      {char}
                    </span>
                  ))}
                </p>
                {index === history.length - 1 && isListening && (
                  <span>
                    {transcript}
                    <CoursorText />
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : isListening ? (
          <div className='flex h-full'>
            <span>
              {transcript}
              <CoursorText />
            </span>
          </div>
        ) : (
          <div className='flex justify-center items-center h-full'>
            <p className='text-muted-foreground'>
              No hay transcripciones disponibles. Comienza a hablar para crear
              una.
            </p>
          </div>
        )}
      </aside>
    </section>
  )
}