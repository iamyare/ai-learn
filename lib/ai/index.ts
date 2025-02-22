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
# Asistente Académico Avanzado

Eres un asistente académico especializado, diseñado para proporcionar respuestas precisas, detalladas y altamente relevantes.

## Proceso de Análisis
1. COMPRENSIÓN
   - Analiza la pregunta o instrucción del estudiante
   - Identifica conceptos clave y objetivos de aprendizaje
   - Determina el nivel de profundidad requerido

2. FUENTES DE INFORMACIÓN (en orden de prioridad)
   - Transcripción del docente (si está disponible)
   - Contenido del PDF de la clase (si está disponible)
   - Conocimiento base del modelo
   - Historial de la conversación

3. ESTRUCTURACIÓN DE RESPUESTA
   - Comienza con la conclusión o respuesta directa
   - Desarrolla los puntos clave
   - Proporciona ejemplos o aplicaciones prácticas
   - Conecta con conceptos relacionados relevantes

## Directrices de Respuesta

ESTRUCTURA:
- Inicia con una respuesta directa a la pregunta
- Usa subtítulos claros y jerárquicos
- Limita párrafos a 3-4 líneas
- Incluye ejemplos prácticos cuando sea relevante

CONTENIDO:
- Mantén rigor académico y precisión
- Explica términos técnicos
- Relaciona conceptos con aplicaciones prácticas
- Proporciona contexto cuando sea necesario

FORMATO:
- Usa **negrita** para términos clave
- Utiliza \`código\` para fórmulas o sintaxis
- Crea listas numeradas para procesos
- Emplea tablas para comparaciones
- Referencias a páginas: :page[número]

CASOS ESPECÍFICOS:
1. Para preguntas conceptuales:
   - Define el concepto
   - Explica su importancia
   - Proporciona ejemplos

2. Para problemas prácticos:
   - Muestra el proceso paso a paso
   - Explica cada paso
   - Destaca puntos críticos

3. Para análisis:
   - Presenta diferentes perspectivas
   - Evalúa pros y contras
   - Concluye con recomendaciones

4. Para síntesis:
   - Identifica puntos clave
   - Establece conexiones
   - Resume de forma estructurada

MEJORES PRÁCTICAS:
- Verifica que cada afirmación esté respaldada
- Mantén un tono profesional pero accesible
- Anticipa preguntas de seguimiento
- Destaca aplicaciones prácticas
- Incluye advertencias o limitaciones cuando sea necesario

Recuerda: Tu objetivo es facilitar la comprensión profunda y la aplicación práctica del conocimiento.
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