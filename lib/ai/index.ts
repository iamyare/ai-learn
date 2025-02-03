'use server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { CoreMessage, streamText, convertToCoreMessages } from 'ai'
import { createStreamableValue } from 'ai/rsc'

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
}

const MAX_MESSAGES = 10
const MAX_MESSAGES_LONG = 5
const MESSAGE_LENGTH_THRESHOLD = 3500 // Caracteres

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
    (msg) => msg.content.length > MESSAGE_LENGTH_THRESHOLD
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
      userPrompt += `${message.role === 'user' ? 'Usuario' : 'Asistente'}: ${
        message.content
      }\n`
    })
    userPrompt += '\n'
  }

  userPrompt += `Pregunta o instrucción actual del estudiante: ${prompt}\n\n`

  return userPrompt.trim() || 'No se ha proporcionado ninguna información específica.'
}

function buildCoreMessages(params: AiStreamParams): CoreMessage[] {
  const { prompt, transcription, messageHistory, pdfBuffer } = params
  
  // Convertir el historial existente
  const historyCoreMessages = convertToCoreMessages(
    truncateHistory(messageHistory).map((msg) => ({
      ...msg,
      content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
    }))
  )
  
  // Construir el contenido del nuevo mensaje
  const newMessageContent: any[] = [{ type: 'text', text: buildPrompt(params) }]
  
  // Agregar el PDF si existe
  if (pdfBuffer) {
    newMessageContent.push({
      type: 'file',
      mimeType: 'application/pdf',
      data: pdfBuffer,
    })
  }
  
  // Agregar el nuevo mensaje al historial
  return [
    ...historyCoreMessages,
    {
      role: 'user',
      content: newMessageContent,
    },
  ]
}

export async function aiStream(params: AiStreamParams) {
  'use server'
  const stream = createStreamableValue()

  try {
    const google = createGoogleGenerativeAI({
      apiKey: params.apiKey
    })

    const messages = buildCoreMessages(params)

    const {textStream} = await streamText({
      model: google('models/gemini-1.5-flash-002'),
      system: SYSTEM_PROMPT,
      messages,
    })

    if (!textStream) {
      throw new Error('No se pudo iniciar el stream de texto')
    }

    ;(async () => {
      try {
        for await (const text of textStream) {
          stream.update(text)
        }
        stream.done()
      } catch (error) {
        console.error('Error en el stream:', error)
        stream.error(error)
      }
    })()

    return { textStream: stream.value}
  } catch (error) {
    console.error('Error en aiStream:', error)
    stream.error(error)
    return { textStream: stream.value }
  }
}