import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText } from 'ai'

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY ?? ''
})

interface MessageType {
  role: 'user' | 'assistant'
  content: string
}

interface AiStreamParams {
  prompt: string
  transcription?: string
  textPdf?: string
  messageHistory: MessageType[]
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
- Resalta términos clave en **negrita**
- Ofrece elaborar solo si es estrictamente necesario

## Formato
- Usa Markdown para estructura
- Resalta términos clave en **negrita**
- Utiliza listas y subtítulos

## Estilo de Respuesta
- Comienza con la información más importante
- Usa frases cortas y precisas
- Incluye solo detalles esenciales
- Si es apropiado, usa viñetas para puntos clave (máximo 3)
- Limita la respuesta a 3-5 frases, a menos que se requiera más detalle

Recuerda: El objetivo es proporcionar la información más relevante de la manera más eficiente posible.
`

function truncateHistory(history: MessageType[]): MessageType[] {
  const isLongConversation = history.some(msg => msg.content.length > MESSAGE_LENGTH_THRESHOLD)
  const limit = isLongConversation ? MAX_MESSAGES_LONG : MAX_MESSAGES
  return history.slice(-limit)
}

function buildPrompt(params: AiStreamParams): string {
  const { prompt, transcription, textPdf, messageHistory } = params
  let userPrompt = ''

  if (transcription) {
    userPrompt += `Transcripción del docente: ${transcription}\n\n`
  }

  if (textPdf) {
    userPrompt += `Contenido del PDF de la clase: ${textPdf}\n\n`
  }

  const truncatedHistory = truncateHistory(messageHistory)
  if (truncatedHistory.length > 0) {
    userPrompt += "Historial de la conversación:\n"
    truncatedHistory.forEach((message) => {
      userPrompt += `${message.role === 'user' ? 'Usuario' : 'Asistente'}: ${message.content}\n`
    })
    userPrompt += "\n"
  }

  userPrompt += `Pregunta o instrucción actual del estudiante: ${prompt}\n\n`

  return userPrompt.trim() || 'No se ha proporcionado ninguna información específica. Por favor, proporciona un resumen general de cómo puedes ayudar en el contexto educativo.'
}

export async function aiStream(params: AiStreamParams): Promise<{ textStream: AsyncIterable<string> }> {
  const userPrompt = buildPrompt(params)

  const { textStream } = await streamText({
    model: google('models/gemini-1.5-flash-latest'),
    system: SYSTEM_PROMPT,
    prompt: userPrompt
  })

  return { textStream }
}