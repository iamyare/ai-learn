import React, {
  useRef,
  useEffect,
  useState,
  useTransition,
  useCallback
} from 'react'
import { cn } from '@/lib/utils'
import { useSpeechRecognitionContext } from '@/context/useSpeechRecognitionContext'
import {
  getTranscriptions,
  createTranscriptNotebook,
  updateTranscriptNotebook
} from '@/actions'
import { TranscriptionSkeleton } from '@/components/skeletons'
import useTextToSpeech from '@/components/ui/useTextToSpeech'
import TranscriptionHeader from './TranscriptionHeader'
import TranscriptionControls from './TranscriptionControls'
import TranscriptionList from './TranscriptionList'
import { CoursorText } from '@/components/ui/coursor-text'
import DragAndDropAudio, {
  TranscriptionLoadingOverlay
} from './DragAndDropAudio'
import { useDropzone } from 'react-dropzone'

interface SpeechRecognitionProps {
  classNameContainer?: string
  classNameHeader?: string
  classNameTranscript?: string
  notebookId: string
}

export default function SpeechRecognition({
  classNameContainer,
  classNameTranscript,
  notebookId
}: SpeechRecognitionProps) {
  const {
    isListening,
    transcript,
    history,
    startListening,
    stopListening,
    updateOptions,
    visualizationOptions
  } = useSpeechRecognitionContext()

  const [isPending, startTransition] = useTransition()
  const [isPendingTranscription, startTransitionTranscription] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdated, setIsUpdated] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null)
  const [showPageNumbers, setShowPageNumbers] = useState(true)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [lastPlayPosition, setLastPlayPosition] = useState(0)
  const [audioFile, setAudioFile] = useState<File | null>(null)

  const fullText =
    history.map((entry) => entry.text).join(' ') + ' ' + transcript
  const {
    speak,
    pause,
    stop,
    isPlaying,
    currentPosition: ttsPosition
  } = useTextToSpeech({ text: fullText })

  useEffect(() => {
    setCurrentPosition(ttsPosition)
  }, [ttsPosition])

  useEffect(() => {
    if (isPlaying) {
      setCurrentPosition(ttsPosition + lastPlayPosition)
    }
  }, [ttsPosition, isPlaying, lastPlayPosition])

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

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isListening) {
        event.preventDefault()
        event.returnValue =
          'Tienes una transcripción en curso. ¿Estás seguro de que quieres salir?'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isListening])

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
      // Eliminar la declaración de isScrolledToBottom si no se usa
      // const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 10
    }
  }

  const handlePositionChange = (newPosition: number) => {
    setCurrentPosition(newPosition)
    setLastPlayPosition(newPosition)
  }

  const handleAction = async () => {
    startTransition(async () => {
      if (isListening) {
        stopListening()
      } else {
        startListening()
      }

      try {
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

        const { transcriptions: updatedTranscriptions } =
          await getTranscriptions({ notebookId })
        if (updatedTranscriptions && updatedTranscriptions.content) {
          const parsedContent = JSON.parse(
            String(updatedTranscriptions.content)
          )
          if (JSON.stringify(parsedContent) === JSON.stringify(history)) {
            setIsUpdated(true)
            setLastUpdateTime(new Date(updatedTranscriptions.updated_at))
          } else {
            setIsUpdated(false)
          }
        } else {
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
      setLastPlayPosition(currentPosition)
      speak(currentPosition)
    }
  }

  const togglePageNumbers = () => {
    setShowPageNumbers(!showPageNumbers)
  }

  const handleFileDrop = useCallback((file: File) => {
    setAudioFile(file)
    // Aquí puedes agregar la lógica para manejar el archivo de audio cargado
    console.log('Archivo de audio cargado:', file)
  }, [])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFileDrop(acceptedFiles[0])
      }
    },
    [handleFileDrop]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg']
    },
    multiple: false
  })

  return (
    <section className={cn('flex flex-col h-full w-full', classNameContainer)}>
      <div className='  flex justify-between items-center'>
        <span></span>
        <TranscriptionControls
          isListening={isListening}
          isPlaying={isPlaying}
          isPending={isPending}
          onMicClick={handleAction}
          onPlayPauseClick={handleTTSAction}
          onStopClick={stop}
          showPageNumbers={showPageNumbers}
          onTogglePageNumbers={togglePageNumbers}
        />
        <TranscriptionHeader
          isUpdated={isUpdated}
          lastUpdateTime={lastUpdateTime}
        />
      </div>
      <aside
        className={cn(
          'w-full h-full px-4 overflow-y-auto relative transcript-scroll-area',
          classNameTranscript
        )}
        ref={scrollAreaRef}
        onScroll={handleScroll}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <TranscriptionSkeleton />
        ) : history.length !== 0 ? (
          <TranscriptionList
            history={history}
            transcript={transcript}
            isListening={isListening}
            currentPosition={currentPosition}
            onPositionChange={handlePositionChange}
            visualizationOptions={visualizationOptions}
            showPageNumbers={showPageNumbers}
            isPlaying={isPlaying}
          />
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
        {!isLoading && !isListening && (isDragActive || audioFile) && (
          <DragAndDropAudio
            onFileDrop={handleFileDrop}
            selectedFile={audioFile}
            onFileDelete={() => setAudioFile(null)}
            onHide={() => setAudioFile(null)}
            startTransitionTranscription={startTransitionTranscription}
            isPendingTranscription={isPendingTranscription}
          />
        )}
        {isPendingTranscription && <TranscriptionLoadingOverlay />}
      </aside>
    </section>
  )
}
