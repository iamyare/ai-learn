import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { AudioDropzoneWrapper } from './AudioDropzoneWrapper'
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
import { updateTranscriptNotebook } from '@/actions'

interface DragAndDropAudioProps {
  onFileDrop: (file: File) => void
  startTransitionTranscription: (isPendingTranscription: boolean) => void
  isPendingTranscription: boolean
  selectedFile?: File | null
  onFileDelete?: () => void
  onTranscriptionComplete?: (transcription: DialogEntry[]) => void
  onHide?: () => void
  notebookId: string
}

export default function DragAndDropAudio({
  onFileDrop,
  startTransitionTranscription,
  isPendingTranscription,
  selectedFile,
  onFileDelete,
  onTranscriptionComplete,
  onHide,
  notebookId
}: DragAndDropAudioProps) {
  const [acceptedFile, setAcceptedFile] = useState<File | null>(
    selectedFile || null
  )
  const { updateOptions, history } = useSpeechRecognitionContext()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setAcceptedFile(acceptedFiles[0])
        onFileDrop(acceptedFiles[0])
      }
    },
    [onFileDrop]
  )

  const handleDelete = useCallback(() => {
    setAcceptedFile(null)
    onFileDelete?.()
    onHide?.()
  }, [onFileDelete, onHide])

  const handleTranscriptionComplete = useCallback(
    async (transcription: DialogEntry[]) => {
      try {
        // Actualizar el contexto con la nueva transcripción
        startTransitionTranscription(true)
        updateOptions({
          history: [...history, ...transcription]
        })
        await updateTranscriptNotebook({
          transcriptHistory: [...history, ...transcription],
          notebookId
        })
        onTranscriptionComplete?.(transcription)
        startTransitionTranscription(false)
      } catch (error) {
        console.error('Error en la transcripción:', error)
      } finally {
        startTransitionTranscription(false) // Asegurarse de que se desactive la transición
      }
    },
    [
      startTransitionTranscription,
      updateOptions,
      history,
      notebookId,
      onTranscriptionComplete
    ]
  )

  function handleHide() {
    onHide?.()
  }

  const getClassName = (
    isDragReject: boolean,
    isDragAccept: boolean,
    isFocused: boolean
  ) => {
    if (isDragReject) return rejectClassAudio
    if (isDragAccept) return acceptClassAudio
    if (isFocused) return focusedClassAudio
    return normalClassAudio
  }

  return (
    <AudioDropzoneWrapper
      isPendingTranscription={isPendingTranscription}
      isLoading={false}
      audioFile={acceptedFile !== null}
      onDrop={onDrop}
    >
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        isFocused
      }) => (
        <div
          {...getRootProps()}
          className={cn(
            'flex absolute inset-0 justify-center items-center border-2 border-dashed rounded-lg m-2',
            getClassName(isDragReject, isDragAccept, isFocused)
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
                  isPendingTranscription={isPendingTranscription}
                  startTransitionTranscription={startTransitionTranscription}
                  hiddenComponent={handleHide}
                />
              )}
              {!acceptedFile && <DropzoneDisplay.Normal />}
            </motion.div>
          )}
        </div>
      )}
    </AudioDropzoneWrapper>
  )
}
