'use client'

import { useDropzone } from 'react-dropzone'
import { useCallback } from 'react'

interface DragAndDropAudioProps {
  onFileDrop: (file: File) => void
}

export default function DragAndDropAudio({
  onFileDrop
}: DragAndDropAudioProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
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
    if (isDragReject) return 'bg-red-500 border-red-500 text-white'
    if (isDragAccept) return 'bg-green-500 border-green-500 text-white'
    if (isFocused) return 'bg-blue-500 border-blue-500 text-white'
    return 'bg-gray-200 border-gray-400 text-gray-700'
  }

  return (
    <div
      {...getRootProps()}
      className={`flex absolute inset-0 justify-center items-center border-2 border-dashed ${getClassName()}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        isDragAccept ? (
          <p>Suelta el archivo aquí...</p>
        ) : (
          <p>Archivo no permitido</p>
        )
      ) : (
        <p>
          Arrastra y suelta un archivo de audio aquí, o haz clic para
          seleccionar uno
        </p>
      )}
    </div>
  )
}
