'use server'
import { supabase } from '@/lib/supabase'

export interface PDFCache {
  hash: string
  cache_id: string | null
  notebook_id: string
  cache_expiration?: string | null
}

export async function getPDFCache(hash: string): Promise<PDFCache | null> {
  const { data, error } = await supabase
    .from('pdf_documents')
    .select('cache_id, notebook_id, cache_expiration')
    .eq('pdf_hash', hash)
    .not('cache_id', 'is', null)
    .not('cache_expiration', 'is', null)
    .maybeSingle()

  if (error || !data) return null

  const now = new Date()
  const expiration = data.cache_expiration ? new Date(data.cache_expiration) : null
  const isExpired = expiration && expiration < now

  if (!isExpired) {
    return {
      hash,
      cache_id: `cachedContents/${data.cache_id?.replace(/^(caches\/|cachedContents\/)/g, '') ?? ''}`,
      notebook_id: data.notebook_id ?? '',
      cache_expiration: data.cache_expiration
    }
  }

  return null
}

export async function updatePDFCache({
  hash,
  cache_id,
  ttl = 3600
}: {
  hash: string
  cache_id: string
  ttl?: number
}): Promise<PDFCache | null> {
  const expirationDate = new Date()
  expirationDate.setSeconds(expirationDate.getSeconds() + ttl)

  // Normalizar el cache_id antes de guardar
  const normalizedCacheId = cache_id.replace(/^(caches\/|cachedContents\/|projects\/-\/locations\/[^\/]+\/cachedContents\/)/g, '')

  const { data, error } = await supabase
    .from('pdf_documents')
    .update({
      cache_id: normalizedCacheId,
      cache_expiration: expirationDate.toISOString()
    })
    .eq('pdf_hash', hash)
    .select()
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to update PDF cache: ${error.message}`)
  }

  return data ? {
    hash,
    cache_id: `cachedContents/${normalizedCacheId}`,
    notebook_id: data.notebook_id,
    cache_expiration: data.cache_expiration
  } : null
}
