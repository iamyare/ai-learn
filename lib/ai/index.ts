
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText } from 'ai'


const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY ?? ''
})

interface MessageType {
  prompt?: string
  transcription?: string
  textPdf?: string
}

export async function aiStream({
  prompt,
  transcription,
  textPdf
}: MessageType) {
  const systemPrompt = `
Eres un asistente educativo especializado en procesar y analizar información de clases universitarias. Tu tarea principal es sintetizar y priorizar la información proporcionada según el siguiente orden de importancia:

1. Transcripción del docente: Esta es tu fuente principal de información.

2. Preguntas o instrucciones específicas del estudiante: Responde directamente a estas si están presentes.

3. Contenido del PDF de la clase: Utiliza esto como información de respaldo o para proporcionar contexto adicional.

Instrucciones específicas:
- Si hay transcripción, analízala minuciosamente buscando información crítica.
- Si no hay transcripción ni pregunta específica, resume el contenido del PDF.
- Prioriza siempre la información más reciente y relevante para el estudiante.
- Proporciona respuestas concisas pero completas, ofreciendo elaborar si es necesario.

Tu objetivo es ayudar al estudiante a comprender y retener la información más importante de la clase, facilitando su aprendizaje y preparación para exámenes.
El formato de la respuesta debe de ser en Markdown.
`

  let userPrompt = ''

  if (transcription) {
    userPrompt += `Transcripción del docente: ${transcription}\n\n`
  }

  if (prompt) {
    userPrompt += `Pregunta o instrucción del estudiante: ${prompt}\n\n`
  }

  if (textPdf) {
    userPrompt += `Contenido del PDF de la clase: ${textPdf}\n\n`
  }

  userPrompt = userPrompt.trim()

  if (!userPrompt) {
    userPrompt =
      'No se ha proporcionado ninguna información específica. Por favor, proporciona un resumen general de cómo puedes ayudar en el contexto educativo.'
  }

  
  const { textStream } = await streamText({
    model: google('models/gemini-1.5-flash-latest'),
    system: systemPrompt,
    prompt: userPrompt
  })

  return { textStream }
}

