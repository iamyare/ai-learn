import { generateImportantEvents } from '@/lib/ai/ai-events'
import { generateChartFromHighlight, explainText, translateText } from '@/lib/ai/ai-highlighter'
import { generateMindMap } from '../ai/ai-map-mental'

export const createEventMessage = async ({ 
  history, 
  text, 
  apiKey 
}: { 
  history: any[], 
  text: string, 
  apiKey: string 
}) => {
  const { object } = await generateImportantEvents({
    prompt: 'Lista de eventos importantes para la próxima semana',
    transcription: history,
    textPdf: text,
    apiKey
  })

  if (!object) throw new Error('No se pudieron generar los eventos importantes')
  
  return {
    events: object,
    isUser: false,
    timestamp: new Date().toISOString()
  }
}

export const createMindMapMessage = async ({
  history,
  text,
  apiKey
}: {
  history: any[],
  text: string,
  apiKey: string
}) => {
  const transcript = history.map((entry) => entry.text).join(' ')
  const { mindMap } = await generateMindMap({
    prompt: 'Crea un mapa mental del contenido de la clase',
    transcription: transcript,
    textPdf: text,
    apiKey
  })

  if (!mindMap) throw new Error('No se pudo generar el mapa mental')

  return {
    mindMap,
    isUser: false,
    timestamp: new Date().toISOString()
  }
}

export const processHighlightedText = async ({
  action,
  text,
  apiKey,
  options
}: {
  action: string,
  text: string,
  apiKey: string,
  options?: { chartType?: string, targetLanguage?: string }
}) => {
  switch (action) {
    case 'note':
      return { noteText: text, isUser: false, timestamp: new Date().toISOString() }
    case 'explain': {
      const result = await explainText({ highlightedText: text, apiKey })
      if (!result?.explanation) throw new Error('No se pudo generar la explicación')
      return { explanation: result.explanation, isUser: false, timestamp: new Date().toISOString() }
    }
    case 'chart': {
      const result = await generateChartFromHighlight({ 
        highlightedText: text, 
        apiKey,
        chartType: options?.chartType as 'bar' | 'line' | 'pie' | 'scatter' | 'area' | undefined
      })
      if (!result?.chartData) throw new Error('No se pudo generar el gráfico')
      return { chartData: result.chartData, isUser: false, timestamp: new Date().toISOString() }
    }
    case 'translate': {
      const result = await translateText({ 
        highlightedText: text, 
        apiKey,
        targetLanguage: options?.targetLanguage
      })
      if (!result?.translation) throw new Error('No se pudo generar la traducción')
      return { translation: result.translation, isUser: false, timestamp: new Date().toISOString() }
    }
    default:
      throw new Error('Acción no soportada')
  }
}
