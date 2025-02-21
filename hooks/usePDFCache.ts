'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface PDFCache {
  hash: string
  cache_id: string | null
  notebook_id: string
  cache_expiration?: string | null
}

interface UpdatePDFCacheParams {
  hash: string
  cache_id: string
  notebook_id: string
  ttl?: number
}

export function usePDFCache(hash: string) {
  const queryClient = useQueryClient()
  const DEFAULT_CACHE_TTL = 60 * 60 // 1 hora en segundos

  // Consultar cache existente
  const { data: cache } = useQuery({
    queryKey: ['pdf-cache', hash],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pdf_documents')
        .select('cache_id, notebook_id, cache_expiration')
        .eq('pdf_hash', hash)
        .not('cache_id', 'is', null)
        .not('cache_expiration', 'is', null)
        .single()

      if (error) return null

      const now = new Date()
      const expiration = data.cache_expiration ? new Date(data.cache_expiration) : null
      const isExpired = expiration && expiration < now

      if (!isExpired) {
        return {
          hash,
          cache_id: data.cache_id,
          notebook_id: data.notebook_id,
          cache_expiration: data.cache_expiration
        }
      }

      return null
    }
  })

  // Actualizar cache
  const { mutate: updateCache } = useMutation({
    mutationFn: async ({ hash, cache_id, notebook_id, ttl = DEFAULT_CACHE_TTL }: UpdatePDFCacheParams) => {
      const expirationDate = new Date()
      expirationDate.setSeconds(expirationDate.getSeconds() + ttl)

      const { error } = await supabase
        .from('pdf_documents')
        .update({
          cache_id,
          cache_expiration: expirationDate.toISOString()
        })
        .eq('pdf_hash', hash)

      if (error) {
        throw new Error(`Failed to update PDF cache: ${error.message}`)
      }

      return {
        hash,
        cache_id,
        notebook_id,
        cache_expiration: expirationDate.toISOString()
      }
    },
    onSuccess: (newCache) => {
      queryClient.setQueryData(['pdf-cache', newCache.hash], newCache)
    }
  })

  return {
    cache,
    updateCache
  }
}