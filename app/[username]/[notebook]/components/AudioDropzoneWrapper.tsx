import { useDropzone } from 'react-dropzone'

interface AudioDropzoneWrapperProps {
  onDrop: (acceptedFiles: File[]) => void
  children: (props: {
    getRootProps: any
    getInputProps: any
    isDragActive: boolean
    isDragAccept: boolean
    isDragReject: boolean
    isFocused: boolean
  }) => React.ReactNode
  isPendingTranscription: boolean
  isLoading: boolean
  audioFile: boolean
}

export const AudioDropzoneWrapper = ({
  onDrop,
  children,
  isPendingTranscription,
  isLoading,
  audioFile
}: AudioDropzoneWrapperProps) => {
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
    multiple: false,
    noClick: isPendingTranscription || isLoading || !audioFile
  })

  return (
    <>
      {children({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        isFocused
      })}
    </>
  )
}
