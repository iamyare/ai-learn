import { useState, useEffect, useCallback, useTransition } from 'react'
import { toast } from '@/components/ui/use-toast'
import { useApiKey } from '@/stores/useApiKeysStore'
import { useSpeechRecognitionStore } from '@/stores/useSpeechRecognitionStore'
import { HighlighterAction, useHighlighterStore } from '@/stores/useHighlighterStore'
import { getChat, createChatNotebook, updateChatNotebook } from '@/actions'
import { generateImportantEvents } from '@/lib/ai/ai-events'
import { generateMindMap } from '@/lib/ai/ai-map-mental'
import { generateChartFromHighlight, explainText, translateText } from '@/lib/ai/ai-highlighter'
import { usePDFStore } from '@/stores/usePDFStore'
import { usePDFTextStore } from '@/stores/usePDFTextStore'
import { useExportStore } from '@/stores/useExportStore'



export function useChatLogic(notebookId: string) {
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [apiKeyGemini, setApiKeyGemini] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isImportantEventsPending, startImportantEventsTransition] = useTransition()
  const [isMindMapPending, startMindMapTransition] = useTransition()

  const geminiKey = useApiKey('gemini_key')
  const { text, extractTextFromPDF } = usePDFTextStore()
  const fileUrl = usePDFStore((state) => state.fileUrl)
  const { history } = useSpeechRecognitionStore()
  const { setActionHandler } = useHighlighterStore()
  const setExportMessages = useExportStore(state => state.setMessages)



  useEffect(() => {
    if (geminiKey) {
      setApiKeyGemini(geminiKey)
    }
  }, [geminiKey])

  useEffect(() => {
    if (fileUrl) {
      extractTextFromPDF(fileUrl)
    }
  }, [fileUrl, extractTextFromPDF])

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

        if (errorChatInsert) {
          console.error('Error al crear el chat:', errorChatInsert)
          return toast({
            title: 'Error',
            description: 'No se pudo crear el chat. Por favor, inténtalo de nuevo más tarde.',
            variant: 'destructive'
          })
        }

        if (chatInsert) {
          setMessages([])
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

  useEffect(() => {
    loadChat()
  }, [loadChat])


  const updateChatInDatabase = useCallback(async (updatedMessages: ChatMessageType[]) => {

    try {
      const { chatUpdate,errorChatUpdate } = await updateChatNotebook({
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


  const handleImportantEvents = useCallback(() => {
    startImportantEventsTransition(async () => {
      try {
        const { object } = await generateImportantEvents({
          prompt: 'Lista de eventos importantes para la próxima semana',
          transcription: history,
          textPdf: text,
          apiKey: apiKeyGemini ?? ''
        })

        if (object) {
          const eventMessage: EventMessageType = {
            events: object,
            isUser: false,
            timestamp: new Date().toISOString()
          }
          setMessages((prev) => {
            const updatedMessages = [...prev, eventMessage]
            updateChatInDatabase(updatedMessages)
            return updatedMessages
          })
        }
      } catch (error) {
        console.error('Error al generar eventos importantes:', error)
        toast({
          title: 'Error',
          description: 'No se pudieron generar los eventos importantes. Por favor, inténtalo de nuevo.',
          variant: 'destructive'
        })
      }
    })
  }, [apiKeyGemini, history, text, updateChatInDatabase])

  const handleGenerateMindMap = useCallback(() => {
    startMindMapTransition(async () => {
      const transcript = history.map((entry) => entry.text).join(' ')
      try {
        const { mindMap } = await generateMindMap({
          prompt: 'Crea un mapa mental del contenido de la clase',
          transcription: transcript,
          textPdf: text,
          apiKey: apiKeyGemini ?? ''
        })


        if (mindMap) {
          const mindMapMessage: MindMapMessageType = {
            mindMap: mindMap,
            isUser: false,
            timestamp: new Date().toISOString()
          }
          setMessages((prev) => {
            const updatedMessages = [...prev, mindMapMessage]
            updateChatInDatabase(updatedMessages)
            return updatedMessages
          })
        }
      } catch (error) {
        console.error('Error al generar el mapa mental:', error)
        toast({
          title: 'Error',
          description: 'No se pudo generar el mapa mental. Por favor, inténtalo de nuevo.',
          variant: 'destructive'
        })
      }
    })
  }, [apiKeyGemini, history, text, updateChatInDatabase])

  useEffect(() => {
    const handleHighlighterAction = async (action: HighlighterAction, text: string, options?: { chartType?: string, targetLanguage?: string }) => {
      if (!apiKeyGemini) {
        toast({ title: 'Error', description: 'API key not found', variant: 'destructive' })
        return
      }
    
      startTransition(async () => {
        try {
          let result;
          switch (action) {
            case 'note':
              result = { noteText: text };
              break;
            case 'explain':
              result = await explainText({ highlightedText: text, apiKey: apiKeyGemini });
              break;
            case 'chart':
              result = await generateChartFromHighlight({ 
                highlightedText: text, 
                apiKey: apiKeyGemini,
                chartType: options?.chartType as 'bar' | 'line' | 'pie' | 'scatter' | 'area' | undefined
              });
              break;
            case 'translate':
              result = await translateText({ 
                highlightedText: text, 
                apiKey: apiKeyGemini,
                targetLanguage: options?.targetLanguage
              });
              break;
          }
    
          if (result) {
            let newMessage;
            if ('noteText' in result) {
              newMessage = { noteText: result.noteText, isUser: false, timestamp: new Date().toISOString() };
            } else if ('chartData' in result) {
              newMessage = { chartData: result.chartData, isUser: false, timestamp: new Date().toISOString() };
            } else if ('explanation' in result) {
              newMessage = { explanation: result.explanation, isUser: false, timestamp: new Date().toISOString() };
            } else if ('translation' in result) {
              newMessage = { translation: result.translation, isUser: false, timestamp: new Date().toISOString() };
            }
    
            if (newMessage) {
              setMessages((prev) => {
                const updatedMessages = [...prev, newMessage];
                updateChatInDatabase(updatedMessages);
                return updatedMessages;
              });
            }
          }
        } catch (error) {
          console.error(`Error al procesar la acción ${action}:`, error);
          toast({
            title: 'Error',
            description: `No se pudo procesar la acción ${action}. Por favor, inténtalo de nuevo.`,
            variant: 'destructive'
          });
        }
      });
    };

    setActionHandler(handleHighlighterAction);

    return () => {
      setActionHandler(() => {}); // Clean up by setting a no-op function
    };
  }, [apiKeyGemini, setActionHandler, updateChatInDatabase]);

  useEffect(() => {
    setExportMessages(messages)
  }, [messages, setExportMessages])

  return {
    messages,
    setMessages,
    isLoading,
    apiKeyGemini,
    isPending: isPending || isImportantEventsPending || isMindMapPending,
    handleImportantEvents,
    handleGenerateMindMap,
    updateChatInDatabase
  }
}