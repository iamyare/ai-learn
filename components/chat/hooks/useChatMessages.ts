import { useState, useCallback, useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'
import { getChat, createChatNotebook, updateChatNotebook } from '@/actions'

export const useChatMessages = (notebookId: string) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadChat = useCallback(async () => {
    if (!notebookId) return

    setIsLoading(true)
    try {
      const { chat, errorChat } = await getChat(notebookId)

      if (chat) {
        if (chat.content) {
          const parsedContent = JSON.parse(String(chat.content))
          setMessages(Array.isArray(parsedContent) ? parsedContent : [])
        } else {
          setMessages([])
        }
      } else if (errorChat) {
        console.error('Error al cargar el chat:', errorChat)
        toast({
          title: 'Error',
          description: 'No se pudo cargar el chat. Por favor, recarga la página.',
          variant: 'destructive'
        })
      } else {
        const { chatInsert, errorChatInsert } = await createChatNotebook({ notebookId })
        if (chatInsert) {
          setMessages([])
        } else if (errorChatInsert) {
          console.error('Error al crear el chat:', errorChatInsert)
          toast({
            title: 'Error',
            description: 'No se pudo crear el chat. Por favor, inténtalo de nuevo más tarde.',
            variant: 'destructive'
          })
        }
      }
    } catch (error) {
      console.error('Error inesperado:', error)
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [notebookId])

  const updateChatInDatabase = useCallback(async (updatedMessages: ChatMessageType[]) => {
    try {
      const { errorChatUpdate } = await updateChatNotebook({
        content: JSON.stringify(updatedMessages),
        notebookId
      })
      if (errorChatUpdate) {
        console.error('Error al actualizar el chat:', errorChatUpdate)
        toast({
          title: 'Advertencia',
          description: 'No se pudo guardar el último mensaje. Algunos mensajes podrían perderse al recargar la página.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error al actualizar el chat:', error)
      toast({
        title: 'Error',
        description: 'Hubo un problema al guardar los mensajes. Por favor, guarda una copia de tu conversación importante.',
        variant: 'destructive'
      })
    }
  }, [notebookId])

  useEffect(() => {
    loadChat()
  }, [loadChat])

  return { messages, setMessages, isLoading, updateChatInDatabase }
}