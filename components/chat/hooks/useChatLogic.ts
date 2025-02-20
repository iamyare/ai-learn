import { useCallback, useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'
import { useApiKey } from '@/stores/useApiKeysStore'
import { useSpeechRecognitionStore } from '@/stores/useSpeechRecognitionStore'
// import { useHighlighterStore } from '@/stores/useHighlighterStore'
import { usePDFStore } from '@/stores/pdfStore'
import { usePDFTextStore } from '@/stores/usePDFTextStore'
import { useExportStore } from '@/stores/useExportStore'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatKeys, fetchChat, updateChat } from '@/lib/queries/chat'
import { createEventMessage, createMindMapMessage, processHighlightedText } from '@/lib/mutations/chat'

export function useChatLogic(notebookId: string) {
  const queryClient = useQueryClient()
  const geminiKey = useApiKey('gemini_key')
  const { text, extractTextFromPDF } = usePDFTextStore()
  const fileUrl = usePDFStore((state) => state.fileUrl)
  const { history } = useSpeechRecognitionStore()
  // const { setActionHandler } = useHighlighterStore()
  const setExportMessages = useExportStore(state => state.setMessages)

  // Chat Query
  const { data: messages = [], isLoading } = useQuery({
    queryKey: chatKeys.chat(notebookId),
    queryFn: () => fetchChat(notebookId),
    enabled: !!notebookId
  })

  // Single mutation for all message updates
  const messageMutation = useMutation({
    mutationFn: async (newMessage: ChatMessageType) => {
      return updateChat({
        notebookId,
        content: JSON.stringify([...messages, newMessage])
      })
    },
    onMutate: async (newMessage) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: chatKeys.chat(notebookId) })
      
      // Guardar el estado anterior
      const previousMessages = queryClient.getQueryData<ChatMessageType[]>(chatKeys.chat(notebookId))
      
      // Optimistic update
      queryClient.setQueryData<ChatMessageType[]>(
        chatKeys.chat(notebookId),
        old => [...(old ?? []), newMessage]
      )
      
      return { previousMessages }
    },
    onError: (err, newMessage, context) => {
      // Revertir a estado anterior en caso de error
      queryClient.setQueryData(
        chatKeys.chat(notebookId),
        context?.previousMessages
      )
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Error al actualizar mensajes',
        variant: 'destructive'
      })
    },
    onSettled: () => {
      // Invalidar query para asegurar sincronización
      queryClient.invalidateQueries({ queryKey: chatKeys.chat(notebookId) })
    }
  })

  const handleAddMessage = useCallback((content: string) => {
    const newMessage: ChatMessageType = {
      content,
      isUser: true,
      timestamp: new Date().toISOString()
    }
    messageMutation.mutate(newMessage)
  }, [messageMutation])

  const handleImportantEvents = useCallback(async () => {
    if (!geminiKey) {
      toast({ title: 'Error', description: 'API key not found' })
      return
    }
    try {
      const message = await createEventMessage({ history, text, apiKey: geminiKey })
      messageMutation.mutate(message)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al generar eventos',
        variant: 'destructive'
      })
    }
  }, [geminiKey, history, text, messageMutation])

  const handleGenerateMindMap = useCallback(async () => {
    if (!geminiKey) {
      toast({ title: 'Error', description: 'API key not found' })
      return
    }
    try {
      const message = await createMindMapMessage({ history, text, apiKey: geminiKey })
      messageMutation.mutate(message)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al generar mapa mental',
        variant: 'destructive'
      })
    }
  }, [geminiKey, history, text, messageMutation])

  // useEffect(() => {
  //   const handleHighlighterAction = async (
  //     action: string, 
  //     text: string, 
  //     options?: { chartType?: string, targetLanguage?: string }
  //   ) => {
  //     if (!geminiKey) {
  //       toast({ title: 'Error', description: 'API key not found' })
  //       return
  //     }
  //     try {
  //       const message = await processHighlightedText({ action, text, apiKey: geminiKey, options })
  //       messageMutation.mutate(message)
  //     } catch (error) {
  //       toast({
  //         title: 'Error',
  //         description: error instanceof Error ? error.message : 'Error al procesar texto',
  //         variant: 'destructive'
  //       })
  //     }
  //   }

  //   setActionHandler(handleHighlighterAction)
  //   return () => setActionHandler(() => {})
  // }, [geminiKey, messageMutation, setActionHandler])

  useEffect(() => {
    if (fileUrl) {
      extractTextFromPDF(fileUrl)
    }
  }, [fileUrl, extractTextFromPDF])

  useEffect(() => {
    setExportMessages(messages)
  }, [messages, setExportMessages])

  return {
    messages,
    isLoading,
    apiKeyGemini: geminiKey,
    isPending: messageMutation.isPending,
    handleImportantEvents,
    handleGenerateMindMap,
    handleAddMessage
  }
}