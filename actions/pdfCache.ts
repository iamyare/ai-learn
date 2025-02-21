'use server'

import { supabase } from '@/lib/supabase'

export interface PDFCache {
  notebook_id: string
  cache_id: string | null
  cache_expiration: string | null
  pdf_hash: string | null
}

export async function getPDFCache(notebook_id: string): Promise<PDFCache | null> {
  try {
    const { data, error } = await supabase
      .from('pdf_documents')
      .select('notebook_id, cache_id, cache_expiration, pdf_hash')
      .eq('notebook_id', notebook_id)
      .single()

    if (error || !data) {
      return null
    }

    return data
  } catch (error) {
    console.error('Error getting PDF cache:', error)
    return null
  }
}

export async function setPDFHash(params: {
  notebook_id: string
  pdf_hash: string
}) {
  const { notebook_id, pdf_hash } = params

  try {
    const { error } = await supabase
      .from('pdf_documents')
      .update({
        pdf_hash
      })
      .eq('notebook_id', notebook_id)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Error setting PDF hash:', error)
    return { success: false }
  }
}

type PDFCacheUpdate = Pick<PDFDocuments, 'notebook_id' | 'cache_id' | 'cache_expiration'>

export async function updatePDFCache(params: PDFCacheUpdate) {
  try {
    const { error } = await supabase
      .from('pdf_documents')
      .update({
        cache_id: params.cache_id,
        cache_expiration: params.cache_expiration
      })
      .eq('notebook_id', params.notebook_id)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating PDF cache:', error)
    return { success: false }
  }
}
