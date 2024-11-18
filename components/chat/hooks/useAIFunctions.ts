import { useCallback } from 'react'
import { toast } from '@/components/ui/use-toast'
import { useSpeechRecognitionStore } from '@/stores/useSpeechRecognitionStore'
import { usePDFTextStore } from '@/stores/usePDFTextStore'
import { generateImportantEvents } from '@/lib/ai/ai-events'
import { generateMindMap } from '@/lib/ai/ai-map-mental'

export const useAIFunctions = (apiKeyGemini: string | null, updateMessages: (newMessage: ChatMessageType) => void) => {
  const { history } = useSpeechRecognitionStore()
  // Usar el store en lugar del contexto
  const { text } = usePDFTextStore()

  const handleImportantEvents = useCallback(async () => {
    if (!apiKeyGemini) {
      toast({
        title: 'Error',
        description: 'API key not found',
        variant: 'destructive'
      })
      return
    }

    const transcript = history.map((entry) => entry.text).join(' ')
    try {
      const { object } = await generateImportantEvents({
        prompt: 'Lista de eventos importantes para la próxima semana',
        transcription: transcript,
        textPdf: text,
        apiKey: apiKeyGemini
      })

      if (object) {
        const eventMessage: EventMessageType = {
          events: object,
          isUser: false,
          timestamp: new Date().toISOString()
        }
        updateMessages(eventMessage)
      }
    } catch (error) {
      console.error('Error al generar eventos importantes:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron generar los eventos importantes. Por favor, inténtalo de nuevo.',
        variant: 'destructive'
      })
    }
  }, [apiKeyGemini, history, text, updateMessages])

  const handleGenerateMindMap = useCallback(async () => {
    if (!apiKeyGemini) {
      toast({
        title: 'Error',
        description: 'API key not found',
        variant: 'destructive'
      })
      return
    }

    const transcript = history.map((entry) => entry.text).join(' ')
    try {
      const { mindMap } = await generateMindMap({
        prompt: 'Crea un mapa mental del contenido de la clase',
        transcription: transcript,
        textPdf: text,
        apiKey: apiKeyGemini
      })


      if (mindMap) {
        const mindMapMessage: MindMapMessageType = {
          mindMap: mindMap,
          isUser: false,
          timestamp: new Date().toISOString()
        }
        updateMessages(mindMapMessage)
      }
    } catch (error) {
      console.error('Error al generar el mapa mental:', error)
      toast({
        title: 'Error',
        description: 'No se pudo generar el mapa mental. Por favor, inténtalo de nuevo.',
        variant: 'destructive'
      })
    }
  }, [apiKeyGemini, history, text, updateMessages])

  return { handleImportantEvents, handleGenerateMindMap }
}