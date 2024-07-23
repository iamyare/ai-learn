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


//obetner folders y notebooks de un usuario de forma responsiva
export async function getFoldersAndNotebooks({userId}: {userId: string}) {
  const { data: folders, error: errorFolders } = await supabase
  .rpc('get_folders_and_notebooks', { p_user_id: userId })

  return { folders, errorFolders };
}

  //Obtener Folders de un usuario
export async function getFolders({userId}: {userId: string}) {
  const { data: folders, error: errorFolders } = await supabase
  .rpc('get_folders', { p_user_id: userId })

  return { folders, errorFolders };
}

  export async function getFolder ({folderId}: {folderId: string}) {
    const { data:folder, error:errorFolder } = await supabase
    .from('folders')
    .select('*, notebooks(*)')
    .eq('folder_id', folderId)
    .single()


    return { folder, errorFolder }
  }

  export async function insertFolder({folderData}:{folderData: FolderInsert}) {
    const { data:folder, error:errorFolder } = await supabase
    .from('folders')
    .insert({...folderData})
    .select('*')
    .single()

    return {folder, errorFolder}
  }

  export async function deleteFolder({folderId}:{folderId: string}) {
    const { error:errorFolder } = await supabase
    .from('folders')
    .delete()
    .eq('folder_id', folderId)

    return { errorFolder}
  }

  export async function getNotebooks ({folderId}: {folderId: string}) {
    const { data: notebooks, error: errorNotebooks } = await supabase
    .from('notebooks')
    .select('*')
    .eq('folder_id', folderId)

    return { notebooks, errorNotebooks }
  }

  export async function getNotebook ({notebookId}: {notebookId: string}) {
    const { data:notebook, error:errorNotebook } = await supabase
    .from('notebooks')
    .select('*')
    .eq('notebook_id', notebookId)
    .single()

    return { notebook, errorNotebook }
  }


  export async function getNotebookInfo ({notebookId}: {notebookId: string}) {
    const { data:notebookInfo, error:errorNotebookInfo } = await supabase
    .from('notebooks')
    .select('*, pdf_document:pdf_documents!inner(*)')
    .eq('notebook_id', notebookId)
    .single()

    return { notebookInfo, errorNotebookInfo }
  }