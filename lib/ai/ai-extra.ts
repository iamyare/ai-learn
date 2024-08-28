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
      Eres un asistente educativo especializado en procesar y analizar información de clases universitarias. Tu tarea es identificar y listar eventos importantes, recordatorios y fechas clave basándote en la información proporcionada. Prioriza la información en el siguiente orden:
  
      1. Transcripción del docente (si está disponible)
      2. Contenido del PDF de la clase
      3. Pregunta o instrucción específica del estudiante
  
      Enfócate especialmente en:
      - Fechas de exámenes
      - Contenido de exámenes
      - Plazos de entrega de trabajos
      - Consejos prácticos del docente
      - Temas clave o conceptos importantes mencionados
  
      Si no hay transcripción ni PDF disponibles, se genera un evento diciendo "No hay eventos importantes".
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
        title: z.string().describe('Título breve del evento o recordatorio'),
        description: z
          .string()
          .describe('Descripción detallada del evento o recordatorio'),
        date: z
          .string()
          .describe(
            'Fecha y hora del evento en formato DD/MM/YYYY HH:MM o "Por determinar" si no se especifica'
          ),
        priority: z
          .enum(['Alta', 'Media', 'Baja'])
          .describe('Prioridad del evento')
      })
    )
  })

  try {
    const { object } = await generateObject({
      model: google('models/gemini-1.5-flash-latest'),
      system: systemPrompt,
      prompt: userPrompt,
      schema: schema
    })

    console.log(object)
    return { object: object.importantEvents }
  } catch (error) {
    return { object: [] }
  }
}
