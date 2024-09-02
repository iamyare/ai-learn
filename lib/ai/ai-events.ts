'use server'

import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateObject} from 'ai'
import { z } from 'zod'

export async function generateImportantEvents({
  prompt = 'Lista de cosas importantes',
  transcription,
  textPdf,
  apiKey
}: {
  prompt?: string
  transcription?: string
  textPdf?: string
  apiKey: string
}) {
  'use server'

  const google = createGoogleGenerativeAI({
    apiKey: apiKey ?? ''
  })

  const systemPrompt = `
  Eres un asistente educativo que analiza información de clases universitarias. Identifica y lista hasta 10 eventos importantes, priorizando:
  
  1. Transcripción del docente
  2. Contenido del PDF de la clase
  3. Pregunta del estudiante
  
  Enfócate en exámenes, entregas de trabajos y cambios de horario/lugar.
  
  Para cada evento, proporciona:
  - Título breve
  - Descripción detallada
  - Fecha y hora (formato YYYY-MM-DD HH:MM:SS+TZ o fecha relativa)
  - Prioridad (Alta, Media, Baja)
  
  Si no hay eventos, genera uno con título "No hay eventos importantes".
  `

  let userPrompt = prompt + '\n\n'

  if (transcription) {
    userPrompt += `Transcripción del docente: ${transcription}\n\n`
  }

  if (textPdf) {
    userPrompt += `Contenido del PDF de la clase: ${textPdf}\n\n`
  }

  const schema = z.object({
    importantEvents: z.array(
      z.object({
        title: z.string().describe('Título conciso y descriptivo del evento'),
        description: z
          .string()
          .describe('Detalles del evento incluyendo lugar, requisitos y consejos importantes'),
        date: z
          .string()
          .describe('Fecha y hora en formato YYYY-MM-DD HH:MM:SS+TZ. Para fechas relativas o inciertas, usa la mejor estimación basada en el contexto'),
        priority: z
          .enum(['Alta', 'Media', 'Baja'])
          .describe('Prioridad basada en urgencia e importancia')
      })
    ).max(10)
  })

  try {
    const { object } = await generateObject({
      model: google('models/gemini-1.5-flash-latest'),
      system: systemPrompt,
      prompt: userPrompt,
      schema: schema
    })

    return { object: object.importantEvents }
  } catch (error) {
    return { object: [] }
  }
}
