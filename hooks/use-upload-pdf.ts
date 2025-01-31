import { useMutation } from '@tanstack/react-query'
import { generateUploadUrl } from '@/actions/upload'

interface UploadResponse {
  url: string
  key: string
}

interface UploadVariables {
  file: File
  userId: string
}

async function uploadToR2({ file, userId }: UploadVariables): Promise<UploadResponse> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Error al subir el archivo: ${response.status}`)
    }

    const data = await response.json()
    return {
      url: data.url,
      key: data.key
    }
  } catch (error) {
    console.error('Error en uploadToR2:', error)
    throw error
  }
}

export function useUploadPdf() {
  return useMutation<UploadResponse, Error, UploadVariables>({
    mutationFn: uploadToR2,
    onError: (error: Error) => {
      console.error('Error uploading file:', error)
      throw error
    }
  })
}
