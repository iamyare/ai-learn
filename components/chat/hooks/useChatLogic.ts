import { useState, useEffect, useCallback, useTransition } from 'react'
import { toast } from '@/components/ui/use-toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApiKey } from '@/context/useAPIKeysContext'
import { usePDFText } from '@/context/usePDFTextExtractionContext'
import { usePDFContext } from '@/context/useCurrentPageContext'
import { useSpeechRecognitionContext } from '@/context/useSpeechRecognitionContext'
import { useHighlighter, HighlighterAction } from '@/context/useHighlighterContext'
import { getChat, createChatNotebook, updateChatNotebook } from '@/actions'
import { aiStream } from '@/lib/ai'
import { generateImportantEvents } from '@/lib/ai/ai-events'
import { generateMindMap } from '@/lib/ai/ai-map-mental'
import { generateChartFromHighlight, explainText, translateText } from '@/lib/ai/ai-highlighter'

const formSchema = z.object({
  message: z.string()
})

export function useChatLogic(notebookId: string) {
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [apiKeyGemini, setApiKeyGemini] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isImportantEventsPending, startImportantEventsTransition] = useTransition()
  const [isMindMapPending, startMindMapTransition] = useTransition()

  const geminiKey = useApiKey('gemini_key')
  const { text, extractTextFromPDF } = usePDFText()
  const { fileUrl } = usePDFContext()
  const { history } = useSpeechRecognitionContext()
  const { setActionHandler } = useHighlighter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' }
  })

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

  useEffect(() => {
    loadChat()
  }, [loadChat])


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

  const handleSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    const userMessage: MessageType = {
      content: values.message,
      isUser: true,
      timestamp: new Date().toISOString()
    }
    setMessages((prev) => [...prev, userMessage])
    form.reset()

    await updateChatInDatabase([...messages, userMessage])

    const transcript = history.map((entry) => entry.text).join(' ')
    const messageHistory = messages
      .filter((msg): msg is MessageType => 'content' in msg)
      .map((msg) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }))

    startTransition(async () => {
      try {
        const { textStream } = await aiStream({
          prompt: values.message ?? 'Realiza un resumen de todo el contenido',
          transcription: transcript,
          textPdf: text,
          messageHistory: messageHistory,
          apiKey: apiKeyGemini ?? ''
        })

        let aiResponse = ''
        for await (const text of textStream) {
          aiResponse += text
          setMessages((prev) => {
            const updatedMessages = [...prev]
            const lastMessage = updatedMessages[updatedMessages.length - 1]
            if (!lastMessage.isUser && 'content' in lastMessage) {
              lastMessage.content = aiResponse
            } else {
              updatedMessages.push({
                content: aiResponse,
                isUser: false,
                timestamp: new Date().toISOString()
              })
            }
            updateChatInDatabase(updatedMessages)
            return updatedMessages
          })
        }
      } catch (err) {
        console.error('Error en el flujo de AI:', err)
        toast({
          title: 'Error',
          description: 'Hubo un problema al procesar tu mensaje. Por favor, inténtalo de nuevo.',
          variant: 'destructive'
        })
      }
    })
  }, [messages, history, text, updateChatInDatabase, form, apiKeyGemini])

  const handleImportantEvents = useCallback(() => {
    startImportantEventsTransition(async () => {
      const transcript = history.map((entry) => entry.text).join(' ')
      try {
        const { object } = await generateImportantEvents({
          prompt: 'Lista de eventos importantes para la próxima semana',
          transcription: transcript,
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
    const handleHighlighterAction = async (action: HighlighterAction, text: string) => {
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
              result = await generateChartFromHighlight({ highlightedText: text, apiKey: apiKeyGemini });
              break;
            case 'translate':
              result = await translateText({ highlightedText: text, apiKey: apiKeyGemini });
              break;
          }

          if (result) {
            let newMessage;
            console.log('Result:', result);
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

  return {
    messages,
    isLoading,
    apiKeyGemini,
    isPending: isPending || isImportantEventsPending || isMindMapPending,
    form,
    handleSubmit,
    handleImportantEvents,
    handleGenerateMindMap
  }
}