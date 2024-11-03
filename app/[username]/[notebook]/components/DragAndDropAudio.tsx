'use client'

import { useDropzone } from 'react-dropzone'
import { useCallback, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  DropzoneDisplay,
  acceptClassAudio,
  focusedClassAudio,
  normalClassAudio,
  rejectClassAudio
} from '@/components/ui/dropzone-display-audio'
import { cn } from '@/lib/utils'
import { DialogEntry } from '@/types/speechRecognition'
import { useSpeechRecognitionContext } from '@/context/useSpeechRecognitionContext'
import { TextSparkles } from '@/components/ui/text-sparkles'

interface DragAndDropAudioProps {
  onFileDrop: (file: File) => void
  startTransitionTranscription: (isPendingTranscription: boolean) => void
  isPendingTranscription: boolean
  selectedFile?: File | null
  onFileDelete?: () => void
  onTranscriptionComplete?: (transcription: DialogEntry[]) => void
  onHide?: () => void // Nueva prop para manejar la visibilidad
}

export default function DragAndDropAudio({
  onFileDrop,
  startTransitionTranscription,
  isPendingTranscription,
  selectedFile,
  onFileDelete,
  onTranscriptionComplete,
  onHide
}: DragAndDropAudioProps) {
  const [acceptedFile, setAcceptedFile] = useState<File | null>(
    selectedFile || null
  )
  const [isVisible, setIsVisible] = useState(true)
  const { updateOptions, history } = useSpeechRecognitionContext()

  useEffect(() => {
    if (selectedFile) {
      setIsVisible(true)
    }
  }, [selectedFile])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setAcceptedFile(acceptedFiles[0])
        onFileDrop(acceptedFiles[0])
        setIsVisible(true) // Asegurarse de que el componente sea visible
      }
    },
    [onFileDrop]
  )

  const handleDelete = useCallback(() => {
    setAcceptedFile(null)
    onFileDelete?.()
    setIsVisible(false)
    onHide?.()
  }, [onFileDelete, onHide])

  const handleTranscriptionComplete = useCallback(
    async (transcription: DialogEntry[]) => {
      startTransitionTranscription(true)
      try {
        // Actualizar el contexto con la nueva transcripción
        updateOptions({
          history: [...history, ...transcription]
        })
        onTranscriptionComplete?.(transcription)
        // Ocultar el componente después de la transcripción exitosa
        setTimeout(() => {
          setIsVisible(false)
          onHide?.()
        }, 1000) // Pequeño delay para mostrar el estado de éxito
      } catch (error) {
        console.error('Error en la transcripción:', error)
      } finally {
        startTransitionTranscription(false)
      }
    },
    [history, updateOptions, onTranscriptionComplete, onHide]
  )

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
      'audio/*': ['.mp3', '.wav', '.ogg']
    },
    multiple: false
  })

  const getClassName = () => {
    if (isDragReject) return rejectClassAudio
    if (isDragAccept) return acceptClassAudio
    if (isFocused) return focusedClassAudio
    return normalClassAudio
  }

  if (!isVisible) return null

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex absolute inset-0 justify-center items-center border-2 border-dashed rounded-lg m-2',
        getClassName()
      )}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        isDragAccept ? (
          <motion.div
            key='accept'
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 50
            }}
          >
            <DropzoneDisplay.Accept />
          </motion.div>
        ) : (
          <motion.div
            key='reject'
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 50
            }}
          >
            <DropzoneDisplay.Reject />
          </motion.div>
        )
      ) : (
        <motion.div
          key='normal'
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20
          }}
        >
          {acceptedFile && (
            <DropzoneDisplay.Info
              file={acceptedFile}
              onDelete={handleDelete}
              onTranscriptionComplete={handleTranscriptionComplete}
              startTransitionTranscription={startTransitionTranscription}
              isPendingTranscription={isPendingTranscription}
            />
          )}
          {!acceptedFile && <DropzoneDisplay.Normal />}
        </motion.div>
      )}
    </div>
  )
}

export function TranscriptionLoadingOverlay() {
  return (
    <>
      <motion.div
        className='absolute inset-0 backdrop-blur-sm bg-background/50'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className='absolute flex inset-0 items-center justify-center'
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
      >
        <TextSparkles text='Generando Transcripción' />
      </motion.div>
    </>
  )
}
