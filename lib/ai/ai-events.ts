'use server'

import { DialogEntry } from '@/types/speechRecognition'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateObject} from 'ai'
import { z } from 'zod'

// Helper functions para manejo de fechas
const toISOString = (date: Date) => {
  return date.toISOString().split('T')[0] // YYYY-MM-DD
}

export async function generateImportantEvents({
  prompt = 'Lista de cosas importantes',
  transcription,
  textPdf,
  apiKey
}: {
  prompt?: string
  transcription?: DialogEntry[]
  textPdf?: string
  apiKey: string
}) {
  'use server'

  const google = createGoogleGenerativeAI({
    apiKey: apiKey ?? ''
  })


  const baseDate = transcription?.[0]?.timestamp 
  ? new Date(transcription[0].timestamp)
  : new Date()

const systemPrompt = `
Eres un asistente educativo que analiza información de clases universitarias. Identifica y lista hasta 10 eventos importantes, priorizando:

1. Transcripción del docente
2. Contenido del PDF de la clase
3. Pregunta del estudiante

Enfócate en exámenes, entregas de trabajos y cambios de horario/lugar.

Para cada evento, proporciona:
- Título breve
- Descripción detallada
- Fecha en formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
- Prioridad (Alta, Media, Baja)

IMPORTANTE SOBRE FECHAS:
- Fecha base actual: ${toISOString(baseDate)}
- Usa formato ISO 8601 completo (YYYY-MM-DDTHH:mm:ss.sssZ)
- Si mencionan "mañana", suma 1 día a la fecha base
- Si mencionan hora específica, mantenla en la zona horaria local

Si no hay eventos, genera uno con título "No hay eventos importantes".
`

  let userPrompt = prompt + '\n\n'

  if (transcription) {
    userPrompt += `Transcripción del docente: ${JSON.stringify(transcription)}\n\n`
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
          .refine((value) => {
            return new Date(value).toISOString() !== 'Invalid Date'
          })
          .describe('Fecha y hora del evento en formato ISO 8601'),
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

    console.log('Important events:', object.importantEvents)
    return { object: object.importantEvents }
  } catch (error) {
    return { object: [] }
  }
}