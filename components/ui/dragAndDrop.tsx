'use client'
import { type DropzoneState, useDropzone } from 'react-dropzone'

import {
  acceptClass,
  DropzoneDisplay,
  focusedClass,
  rejectClass
} from './dropzone-display'
import { uploadPdf } from '@/actions'
import { useTransition } from 'react'
import { supabase } from '@/lib/supabase'

export default function DragAndDrop() {

    const [isPending, startTransition] = useTransition()

  const onDrop = async (acceptedFiles: File[]) => {
    // Verifica que se haya seleccionado al menos un archivo
    console.log('Archivo seleccionado: ', acceptedFiles[0])
    startTransition(async() => {
        const { data, error } = await supabase
        .storage
        .from('pdf_documents')
        .upload(`${acceptedFiles[0].name}.pdf`, acceptedFiles[0])

        if (error) {
            console.log('Error al subir el archivo: ', error)
            return
        }

        console.log('Archivo subido correctamente: ', data)
    })


  }

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive,
    acceptedFiles
}: DropzoneState = useDropzone({
    onDrop,
    accept: {
      'application/pdf': []
    },
    multiple: false,
    maxSize: 5000000 // 5MB
  })

  // Utiliza una función para determinar qué clase aplicar
  const getClassName = () => {
    if (isDragReject) return rejectClass
    if (isDragAccept) return acceptClass
    if (isFocused) return focusedClass
  }



  return (
    <div
      {...getRootProps()}
      className={` absolute top-0 left-0 z-50 bg-background/50 backdrop-blur-sm w-full h-full flex justify-center  items-center transition-colors duration-500 ${getClassName()}`}
    >
      <div className=' flex flex-col justify-center items-center'>
        <input name='file' {...getInputProps()} />

        {acceptedFiles.length > 0 ? (
          <DropzoneDisplay.Info file={acceptedFiles[0]} />
        ) : (
          <>
            {isDragAccept && (
              <div>
                <DropzoneDisplay.Accept />
              </div>
            )}
            {isDragReject && (
              <div>
                <DropzoneDisplay.Reject />
              </div>
            )}

          </>
        )}
      </div>
    </div>
  )
}
