import { useMemo, useEffect, useState } from 'react'
import { usePDFStore } from '@/stores/pdfStore'

export const usePDFUrl = (fileUrl: string) => {
  const [error, setError] = useState<string | null>(null)
  const { setPDFBuffer } = usePDFStore()

  const pdfProxyUrl = useMemo(() => {
    try {
      const match = fileUrl.match(/\.com\/(.*)/)
      if (!match) throw new Error('URL malformada')
      
      const path = match[1]
        .split('/')
        .map(segment => encodeURIComponent(segment))
        .join('/')
      
      return `/api/pdf/${path}`
    } catch (err) {
      console.error('Error procesando URL:', {
        error: err,
        originalUrl: fileUrl
      })
      setError('Error al procesar la URL del PDF')
      return null
    }
  }, [fileUrl])

  useEffect(() => {
    const loadPDFBuffer = async () => {
      if (pdfProxyUrl) {
        try {
          const response = await fetch(pdfProxyUrl)
          const buffer = await response.arrayBuffer()
          setPDFBuffer(buffer)
        } catch (err) {
          console.error('Error cargando buffer del PDF:', err)
          setError('Error al cargar el buffer del PDF')
        }
      }
    }

    loadPDFBuffer()
  }, [pdfProxyUrl, setPDFBuffer])

  return { pdfProxyUrl, error }
}