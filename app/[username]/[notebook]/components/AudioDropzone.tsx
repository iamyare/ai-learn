import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import DragAndDropAudio, { TranscriptionLoadingOverlay } from './DragAndDropAudio'
import { AnimatePresence } from 'framer-motion'

interface AudioDropzoneProps {
  isLoading: boolean
  isListening: boolean
  children: React.ReactNode
  onTranscriptionStart: () => void
  isPendingTranscription: boolean
}

export const AudioDropzone = ({
  isLoading,
  isListening,
  children,
  onTranscriptionStart,
  isPendingTranscription
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg']
    },
    multiple: false
  })

  return (
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
        />
      )}
      <AnimatePresence>
        {isPendingTranscription && <TranscriptionLoadingOverlay />}
      </AnimatePresence>
    </div>
  )
}
