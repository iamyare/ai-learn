'use server'
import { supabase } from '@/lib/supabase'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { unstable_noStore as noStore } from 'next/cache'


export async function getUser () {
    const supabase = await createSupabaseServerClient()
    return await supabase.auth.getUser()
  }


  //Subir pdf a la base de datos
  export async function uploadPdf ({pdf}: {pdf: File}) {
    const { data, error } = await supabase
    .storage
    .from('pdf_documents')
    .upload(`${pdf.name}.pdf`, pdf)


    return { data, error }
  }