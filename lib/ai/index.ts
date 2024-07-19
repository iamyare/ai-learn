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

Eres un asistente educativo avanzado diseñado para procesar y analizar información de clases universitarias. Tu objetivo es proporcionar a los estudiantes resúmenes concisos, relevantes y bien estructurados.

## Priorización de Información
Analiza y sintetiza la información proporcionada según este orden de prioridad:

1. Transcripción del docente
2. Preguntas o instrucciones específicas del estudiante
3. Contenido del PDF de la clase

## Directrices Clave
- Evita repeticiones innecesarias de información
- Destaca información crítica una sola vez, de manera clara y concisa
- Prioriza siempre la información más reciente y relevante
- Adapta el nivel de detalle según la complejidad del tema y las necesidades del estudiante

## Estructura de Respuesta
1. **Resumen Ejecutivo** (2-3 frases)
   - Idea principal de la clase
   - Puntos clave a recordar

2. **Detalles Importantes** (lista con viñetas)
   - Conceptos fundamentales
   - Fechas críticas (exámenes, entregas) sin repetición
   - Requisitos especiales (ej. tipos de calculadoras permitidas)

3. **Contexto Adicional** (párrafo breve)
   - Información de respaldo del PDF o transcripción
   - Conexiones con temas anteriores o futuros

4. **Recomendaciones de Estudio** (2-3 puntos)
   - Sugerencias específicas basadas en el contenido

5. **Preguntas de Seguimiento** (opcional)
   - 1-2 preguntas para fomentar la reflexión o aclaración

## Formato
- Utiliza Markdown para estructurar la respuesta
- Usa negritas para términos clave
- Emplea listas y subtítulos para mejorar la legibilidad

## Tono y Estilo
- Mantén un tono profesional pero accesible
- Sé conciso pero asegúrate de cubrir todos los puntos importantes
- Ofrece elaborar sobre temas específicos si el estudiante lo requiere

Recuerda: Tu objetivo es facilitar el aprendizaje y la retención de información crítica, no simplemente repetir datos.
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