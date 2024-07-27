'use server'
import { supabase } from '@/lib/supabase'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { DialogEntry } from '@/types/speechRecognition'

export async function getUser() {
  const supabase = await createSupabaseServerClient()
  return await supabase.auth.getUser()
}

//Obtener usuario y user
export async function getUserInfo() {
  const { data, error } = await getUser()

  if (error) {
    return { user: null, errorUser: error }
  }

  if (!data.user?.id) {
    return { user: null, errorUser: new Error('User ID is undefined') }
  }

  const { data: user, error: errorUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single()

  return { user, errorUser }
}

//Subir pdf a la base de datos
export async function uploadPdf({ pdf }: { pdf: File }) {
  const { data, error } = await supabase.storage
    .from('pdf_documents')
    .upload(`${pdf.name}.pdf`, pdf)

  return { data, error }
}

//obetner folders y notebooks de un usuario de forma responsiva
export async function getFoldersAndNotebooks({
  userId,
  parentFolderId
}: {
  userId: string
  parentFolderId: string | undefined
}) {
  const { data: folders, error: errorFolders } = await supabase.rpc(
    'get_folders_and_notebooks',
    { p_user_id: userId, p_parent_folder_id: parentFolderId }
  )

  return { folders, errorFolders }
}

//Obtener Folders de un usuario
export async function getFolders({ userId }: { userId: string }) {
  const { data: folders, error: errorFolders } = await supabase.rpc(
    'get_folders',
    { p_user_id: userId }
  )

  return { folders, errorFolders }
}

export async function getFolder({ folderId }: { folderId: string }) {
  const { data: folder, error: errorFolder } = await supabase
    .from('folders')
    .select('*, notebooks(*)')
    .eq('folder_id', folderId)
    .single()

  return { folder, errorFolder }
}

export async function insertFolder({
  folderData
}: {
  folderData: FolderInsert
}) {
  const { data: folder, error: errorFolder } = await supabase
    .from('folders')
    .insert({ ...folderData })
    .select('*')
    .single()

  return { folder, errorFolder }
}

export async function deleteFolder({ folderId }: { folderId: string }) {
  const { error: errorFolder } = await supabase
    .from('folders')
    .delete()
    .eq('folder_id', folderId)

  return { errorFolder }
}

export async function deleteNotebook({ notebookId }: { notebookId: string }) {
  const { error: errorNotebook } = await supabase
    .from('notebooks')
    .delete()
    .eq('notebook_id', notebookId)

  return { errorNotebook }
}

export async function getNotebooks({ folderId }: { folderId: string }) {
  const { data: notebooks, error: errorNotebooks } = await supabase
    .from('notebooks')
    .select('*')
    .eq('folder_id', folderId)

  return { notebooks, errorNotebooks }
}

export async function getNotebook({ notebookId }: { notebookId: string }) {
  const { data: notebook, error: errorNotebook } = await supabase
    .from('notebooks')
    .select('*')
    .eq('notebook_id', notebookId)
    .single()

  return { notebook, errorNotebook }
}

export async function getNotebookInfo({ notebookId }: { notebookId: string }) {
  const { data: notebookInfo, error: errorNotebookInfo } = await supabase
    .from('notebooks')
    .select('*, pdf_document:pdf_documents!inner(*)')
    .eq('notebook_id', notebookId)
    .single()

  return { notebookInfo, errorNotebookInfo }
}

//Obtener transcripciones de un notebook
export async function getTranscriptions({
  notebookId
}: {
  notebookId: string
}) {
  const { data: transcriptions, error: errorTranscriptions } = await supabase
    .from('transcriptions')
    .select('*')
    .eq('notebook_id', notebookId)
    .maybeSingle()

  return { transcriptions, errorTranscriptions }
}

//Create transcript notebook
export async function createTranscriptNotebook({
  transcriptHistory,
  notebookId
}: {
  transcriptHistory: DialogEntry[]
  notebookId: string
}) {
  const { data: transcriptInsert, error: errorTranscriptInsert } =
    await supabase
      .from('transcriptions')
      .insert({
        notebook_id: notebookId,
        content: JSON.stringify(transcriptHistory)
      })
      .select('*')
      .single()

  return { transcriptInsert, errorTranscriptInsert }
}

//Update transcript notebook
export async function updateTranscriptNotebook({
  transcriptHistory,
  notebookId
}: {
  transcriptHistory: DialogEntry[]
  notebookId: string
}) {
  const { data: transcriptUpdate, error: errorTranscriptUpdate } =
    await supabase
      .from('transcriptions')
      .update({ content: JSON.stringify(transcriptHistory) })
      .eq('notebook_id', notebookId)
      .select('*')
      .single()

  return { transcriptUpdate, errorTranscriptUpdate }
}

//Obtener chat de un notebook
export async function getChat(notebookId: string) {
  const { data: chat, error: errorChat } = await supabase
    .from('chats')
    .select('*')
    .eq('notebook_id', notebookId)
    .maybeSingle()

  return { chat, errorChat }
}

//Create chat notebook
export async function createChatNotebook({ notebookId }: { notebookId: string }) {
  const { data: chatInsert, error: errorChatInsert } = await supabase
    .from('chats')
    .insert({ notebook_id: notebookId })
    .select('*')
    .single()

  return { chatInsert, errorChatInsert }
}

//Update chat notebook
export async function updateChatNotebook({
  content,
  notebookId
}: {
  content: string
  notebookId: string
}) {
  const { data: chatUpdate, error: errorChatUpdate } = await supabase
    .from('chats')
    .update({ content })
    .eq('notebook_id', notebookId)
    .select('*')
    .single()

  return { chatUpdate, errorChatUpdate }
}