/* eslint-disable @next/next/no-img-element */
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageIcon, XCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AvatarDropzoneProps {
  onImageDrop: (file: File) => void
  imagePreviewInit: string | null
}

const iconStyles = {
  base: '  size-8',
  accept: 'text-primary opacity-50',
  normal: 'text-muted-foreground opacity-50',
  reject: 'text-destructive opacity-50'
}

const StyledIcon = ({ type }: { type: 'accept' | 'normal' | 'reject' }) => {
  const className = `${iconStyles.base} ${iconStyles[type]}`

  return <ImageIcon className={className} aria-hidden='true' />
}

export const AvatarDropzone = ({
  onImageDrop,
  imagePreviewInit
}: AvatarDropzoneProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    imagePreviewInit
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setImagePreview(URL.createObjectURL(file))
        onImageDrop(file)
      }
    },
    [onImageDrop]
  )

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setImagePreview(null)
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  })

  const dropzoneClass = cn(
    ' size-32 min-w-32 aspect-square overflow-hidden border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer',
    {
      'border-primary bg-primary/5 ': isDragAccept,
      'border-destructive bg-destructive/5': isDragReject,
      'border-muted-foreground/25 hover:border-primary/50': !isDragActive
    }
  )

  return (
    <div {...getRootProps()} className={dropzoneClass}>
      <input {...getInputProps()} />
      <AnimatePresence mode='wait'>
        {!imagePreview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='flex flex-col items-center gap-4'
          >
            {isDragAccept && <StyledIcon type='accept' />}
            {isDragReject && <StyledIcon type='reject' />}
            {!isDragActive && <StyledIcon type='normal' />}

            <div className='flex flex-col text-center'>
              <p className='text-xs text-muted-foreground'>
                {isDragActive
                  ? 'Suelta la imagen aquí...'
                  : 'Arrastra y suelta una imagen de avatar aquí'}
              </p>
            </div>
          </motion.div>
        )}

        {imagePreview && (
          <motion.div
            className='relative'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <img
              src={imagePreview}
              alt='Avatar Preview'
              className=' size-32 rounded-full mx-auto object-cover p-1'
            />
            <div className=' absolute -top-2 -right-2 z-50  flex items-center gap-2'>
              <Button
                variant='ghost'
                onClick={handleDelete}
                size='icon'
                className='text-destructive hover:text-destructive hover:bg-destructive/10'
              >
                <XCircleIcon className='size-5' />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
