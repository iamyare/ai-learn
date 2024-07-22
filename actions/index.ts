'use server'
import { supabase } from '@/lib/supabase'
import { createSupabaseServerClient } from '@/lib/supabase/server'


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


  //Obtener Folders de un usuario
export async function getFolders({userId}: {userId: string}) {
  const { data: folders, error: errorFolders } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', userId);

  console.log(folders, errorFolders);

  return { folders, errorFolders };
}

  export async function getFolder ({folderId}: {folderId: string}) {
    const { data:folder, error:errorFolder } = await supabase
    .from('folders')
    .select('*, notebooks!inner(*)')
    .eq('folder_id', folderId)
    .single()

    console.log(folder, errorFolder)

    return { folder, errorFolder }
  }