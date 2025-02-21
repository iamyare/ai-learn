'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPDFCache, updatePDFCache, type PDFCache } from '@/actions/pdfCache'

interface UpdatePDFCacheParams {
  hash: string
  cache_id: string
  notebook_id: string
  ttl?: number
}

export function usePDFCache(hash: string) {
  const queryClient = useQueryClient()

  // Consultar cache existente
  const { data: cache } = useQuery({
    queryKey: ['pdf-cache', hash],
    queryFn: () => getPDFCache(hash)
  })

  // Actualizar cache
  const { mutate: updateCache } = useMutation({
    mutationFn: async ({ hash, cache_id, ttl }: UpdatePDFCacheParams) => {
      return updatePDFCache({ hash, cache_id, ttl })
    },
    onSuccess: (newCache) => {
      if (newCache) {
        queryClient.setQueryData(['pdf-cache', newCache.hash], newCache)
      }
    }
  })

  return {
    cache,
    updateCache
  }
}