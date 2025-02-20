import { getChat, createChatNotebook, updateChatNotebook } from '@/actions'
import { type PostgrestError } from '@supabase/supabase-js'

export const chatKeys = {
  all: ['chats'] as const,
  chat: (notebookId: string) => ['chats', notebookId] as const
}

export const fetchChat = async (notebookId: string) => {
  const { chat, errorChat } = await getChat(notebookId)
  
  if (errorChat) {
    throw new Error(errorChat instanceof Error ? errorChat.message : String(errorChat))
  }
  
  if (!chat) {
    const { chatInsert, errorChatInsert } = await createChatNotebook({ notebookId })
    if (errorChatInsert) {
      throw new Error(errorChatInsert instanceof Error ? errorChatInsert.message : String(errorChatInsert))
    }
    return []
  }

  return chat.content ? JSON.parse(String(chat.content)) : []
}

export const updateChat = async ({ notebookId, content }: { notebookId: string, content: string }) => {
  const { chatUpdate, errorChatUpdate } = await updateChatNotebook({
    content,
    notebookId
  })

  if (errorChatUpdate) {
    throw new Error(errorChatUpdate instanceof Error ? errorChatUpdate.message : String(errorChatUpdate))
  }
  return chatUpdate
}
