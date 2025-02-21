'use server'

import { supabase } from '@/lib/supabase'

export interface PDFCache {
  notebook_id: string
  cache_id: string | null
  cache_expiration: string | null
  pdf_hash: string | null
}

function normalizeCacheId(cacheId: string | null): string | null {
  if (!cacheId) return null;
  return cacheId
    .replace(/^(projects\/-\/locations\/[^\/]+\/)?cachedContents\//g, '')
    .replace(/^caches\//g, '')
    .trim();
}

export async function getPDFCache(notebook_id: string): Promise<PDFCache | null> {
  try {
    const { data, error } = await supabase
      .from('pdf_documents')
      .select('notebook_id, cache_id, cache_expiration, pdf_hash')
      .eq('notebook_id', notebook_id)
      .single();

    if (error || !data) return null;

    // Normalizar el cache_id antes de devolverlo
    return {
      ...data,
      cache_id: data.cache_id ? `caches/${normalizeCacheId(data.cache_id)}` : null
    };
  } catch (error) {
    console.error('Error getting PDF cache:', error);
    return null;
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
    const normalizedCacheId = normalizeCacheId(params.cache_id);
    const { error } = await supabase
      .from('pdf_documents')
      .update({
        cache_id: normalizedCacheId,
        cache_expiration: params.cache_expiration
      })
      .eq('notebook_id', params.notebook_id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating PDF cache:', error);
    return { success: false };
  }
}
