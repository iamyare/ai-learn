'use client'

import { useDropzone } from 'react-dropzone'
import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import {
  DropzoneDisplay,
  acceptClassAudio,
  focusedClassAudio,
  normalClassAudio,
  rejectClassAudio
} from '@/components/ui/dropzone-display-audio'
import { cn } from '@/lib/utils'

interface DragAndDropAudioProps {
  onFileDrop: (file: File) => void
}

export default function DragAndDropAudio({
  onFileDrop
}: DragAndDropAudioProps) {
  const [acceptedFile, setAcceptedFile] = useState<File | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setAcceptedFile(acceptedFiles[0])
        onFileDrop(acceptedFiles[0])
      }
    },
    [onFileDrop]
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
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20
          }}
        >
          {acceptedFile && <DropzoneDisplay.Info file={acceptedFile} />}
          {!acceptedFile && <DropzoneDisplay.Normal />}
        </motion.div>
      )}
    </div>
  )
}
