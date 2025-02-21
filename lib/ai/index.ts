'use server'
import { createStreamableValue } from 'ai/rsc'
import { convertToCoreMessages } from 'ai'
import { logger } from '@/lib/utils/logger'
import { GeminiService, createGeminiService } from '@/lib/services/gemini'

interface MessageType {
  role: 'user' | 'assistant'
  content: string | Array<{ type: string; text?: string; file?: { type: string; data: ArrayBuffer } }>
}

interface AiStreamParams {
  prompt: string
  transcription?: string
  messageHistory: MessageType[]
  apiKey: string
  pdfBuffer?: ArrayBuffer | null
  existingCacheId?: string
}

const MAX_MESSAGES = 10
const MAX_MESSAGES_LONG = 5
const MESSAGE_LENGTH_THRESHOLD = 3500

const SYSTEM_PROMPT = `
# Asistente Educativo IA

Eres un asistente educativo diseñado para proporcionar respuestas concisas y directas sobre temas universitarios.

## Prioridades
1. Transcripción del docente
2. Preguntas o instrucciones del estudiante
3. Contenido del PDF de la clase

## Directrices
- Responde de forma directa y concisa
- Enfócate solo en la información más relevante
- Evita estructuras predefinidas o formatos rígidos
- Adapta la respuesta a la pregunta específica
- Usa lenguaje claro y accesible

## Formato
- Usa Markdown para estructura
- Resalta términos clave en **negrita**
- Utiliza listas, subtítulos y titulares.

## Estilo de Respuesta
- Incluye un BLOQUE DE PÁGINA DE INICIO {número de página}, la IA usará el {número de página} en la respuesta para informar al usuario dónde se encontró la información, el número de página debe tener este formato: :page[{número de página}].
- Comienza con la información más importante
- Incluye solo detalles esenciales
- Si es apropiado, usa viñetas para puntos clave (máximo 5)
- Utilizar titulares y subtítulos para organizar la información

Recuerda: El objetivo es proporcionar la información más relevante de la manera más eficiente posible.
`

function truncateHistory(history: MessageType[]): MessageType[] {
  const isLongConversation = history.some(
    (msg) => typeof msg.content === 'string' && msg.content.length > MESSAGE_LENGTH_THRESHOLD
  )
  const limit = isLongConversation ? MAX_MESSAGES_LONG : MAX_MESSAGES
  return history.slice(-limit)
}

function buildPrompt(params: AiStreamParams): string {
  const { prompt, transcription, messageHistory } = params
  let userPrompt = ''

  if (transcription) {
    userPrompt += `Transcripción del docente: ${transcription}\n\n`
  }

  const truncatedHistory = truncateHistory(messageHistory)
  if (truncatedHistory.length > 0) {
    userPrompt += 'Historial de la conversación:\n'
    truncatedHistory.forEach((message) => {
      const content = typeof message.content === 'string' 
        ? message.content 
        : message.content.map(c => c.text || '').join(' ')
      userPrompt += `${message.role === 'user' ? 'Usuario' : 'Asistente'}: ${content}\n`
    })
    userPrompt += '\n'
  }

  userPrompt += `Pregunta o instrucción actual del estudiante: ${prompt}\n\n`

  return userPrompt.trim() || 'No se ha proporcionado ninguna información específica.'
}

export async function aiStream(params: AiStreamParams) {
  'use server'
  const stream = createStreamableValue()

  try {
    const service = await createGeminiService(params.apiKey)


    const { stream: textStream, getTokenUsage, newCacheId } = await service.generateStreamingContent({
      prompt: buildPrompt(params),
      systemPrompt: params.existingCacheId ? undefined : SYSTEM_PROMPT,
      temperature: 0.7,
      pdfBuffer: params.pdfBuffer,
      existingCacheId: params.existingCacheId
    })

    logger.info('Service response', {
      hasCache: !!params.existingCacheId,
      newCacheId,
      pdfSize: params.pdfBuffer ? Math.round(params.pdfBuffer.byteLength / 1024) + 'KB' : 'none',
      existingCacheId: params.existingCacheId || 'none'
    })

    // Retornar el newCacheId junto con el stream
    ;(async () => {
      try {
        for await (const chunk of textStream) {
          stream.update(chunk)
        }
        stream.done()
      } catch (error) {
        logger.error('Error in stream', {
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        stream.error(error)
      }
    })()

            // Obtener y registrar el uso de tokens después de completar el stream
            const tokenUsage = getTokenUsage()
            if (tokenUsage) {
              logger.info('AI stream completed', {
                tokenUsage,
                messageCount: params.messageHistory.length
              })
            }

    return { textStream: stream.value, newCacheId }
  } catch (error) {
    logger.error('Error in aiStream', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    stream.error(error)
    return { textStream: stream.value, newCacheId: undefined }
  }
}