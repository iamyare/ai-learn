import { useCallback, useState } from 'react'
import { AudioDropzoneWrapper } from './AudioDropzoneWrapper'
import DragAndDropAudio from './DragAndDropAudio'
import { AnimatePresence, motion } from 'framer-motion'
import { TextSparkles } from '@/components/ui/text-sparkles'

interface AudioDropzoneProps {
  isLoading: boolean
  isListening: boolean
  children: React.ReactNode
  onTranscriptionStart: (isPendingTranscription: boolean) => void
  isPendingTranscription: boolean
  notebookId: string
}

export const AudioDropzone = ({
  isLoading,
  isListening,
  children,
  onTranscriptionStart,
  isPendingTranscription,
  notebookId
}: AudioDropzoneProps) => {
  const [audioFile, setAudioFile] = useState<File | null>(null)

  const handleFileDrop = useCallback((file: File) => {
    setAudioFile(file)
  }, [])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFileDrop(acceptedFiles[0])
      }
    },
    [handleFileDrop]
  )

  return (
    <AudioDropzoneWrapper
      isPendingTranscription={isPendingTranscription}
      isLoading={false}
      audioFile={audioFile ? true : false}
      onDrop={onDrop}
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {children}
          {!isLoading && !isListening && (isDragActive || audioFile) && (
            <DragAndDropAudio
              onFileDrop={handleFileDrop}
              selectedFile={audioFile}
              onFileDelete={() => setAudioFile(null)}
              onHide={() => setAudioFile(null)}
              startTransitionTranscription={onTranscriptionStart}
              isPendingTranscription={isPendingTranscription}
              notebookId={notebookId}
            />
          )}
          <AnimatePresence>
            {isPendingTranscription && <TranscriptionLoadingOverlay />}
          </AnimatePresence>
        </div>
      )}
    </AudioDropzoneWrapper>
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
