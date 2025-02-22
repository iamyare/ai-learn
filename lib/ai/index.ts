'use server'
import { createStreamableValue } from 'ai/rsc'
import { convertToCoreMessages } from 'ai'
import { logger } from '@/lib/utils/logger'
import { GeminiService, createGeminiService } from '@/lib/services/gemini'
import { SYSTEM_PROMPT_AI_STREAM } from '@/constants/system-prompt'

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
      systemPrompt: SYSTEM_PROMPT_AI_STREAM,
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
        
        // Obtener y registrar el uso de tokens después de completar el stream
        const tokenUsage = getTokenUsage()
        if (tokenUsage) {
          logger.info('AI stream completed', {
            tokenUsage,
            messageCount: params.messageHistory.length
          })
        } else {
          logger.warn('No token usage data available')
        }

        stream.done()
      } catch (error) {
        logger.error('Error in stream', {
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        stream.error(error)
      }
    })()

    return { textStream: stream.value, newCacheId }
  } catch (error) {
    logger.error('Error in aiStream', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    stream.error(error)
    return { textStream: stream.value, newCacheId: undefined }
  }
}