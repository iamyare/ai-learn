'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPDFCache, PDFCache, setPDFHash, updatePDFCache } from '@/actions/pdfCache'

export function usePDFCache(notebook_id: string) {
  const queryClient = useQueryClient()
  const DEFAULT_CACHE_TTL = 60 * 60 // 1 hora en segundos

  // Consultar cache existente
  const { data: cache } = useQuery<PDFCache | null>({
    queryKey: ['pdf-cache', notebook_id],
    queryFn: () => getPDFCache(notebook_id)
  })

  // Establecer hash del PDF
  const { mutate: setHash } = useMutation({
    mutationFn: async (pdf_hash: string) => {
      return setPDFHash({
        notebook_id,
        pdf_hash
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdf-cache', notebook_id] })
    }
  })

  // Actualizar cache
  const { mutate: updateCache } = useMutation({
    mutationFn: async ({ cache_id, cache_expiration }: { cache_id: string | null, cache_expiration?: string | null }) => {
      const expirationDate = new Date()
      expirationDate.setSeconds(expirationDate.getSeconds() + DEFAULT_CACHE_TTL)

      return updatePDFCache({
        notebook_id,
        cache_id: cache_id ? (cache_id.startsWith('caches/') ? cache_id : `caches/${cache_id}`) : null,
        cache_expiration: cache_expiration ?? (cache_id ? expirationDate.toISOString() : null)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdf-cache', notebook_id] })
    }
  })

  return {
    cache,
    setHash,
    updateCache
  }
}