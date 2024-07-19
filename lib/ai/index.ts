"use server"
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText, streamObject } from 'ai'
import { createStreamableValue } from 'ai/rsc';
import { z } from 'zod';

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

1. Transcripción del docente: Esta es tu fuente principal de información. Presta especial atención a:
   - Fechas de exámenes
   - Contenido de exámenes
   - Consejos prácticos
   - Explicaciones sobre el material de clase

2. Preguntas o instrucciones específicas del estudiante: Responde directamente a estas si están presentes.

3. Contenido del PDF de la clase: Utiliza esto como información de respaldo o para proporcionar contexto adicional.

Instrucciones específicas:
- Si hay transcripción, analízala minuciosamente buscando información crítica.
- Si no hay transcripción ni pregunta específica, resume el contenido del PDF.
- Prioriza siempre la información más reciente y relevante para el estudiante.
- Proporciona respuestas concisas pero completas, ofreciendo elaborar si es necesario.

Tu objetivo es ayudar al estudiante a comprender y retener la información más importante de la clase, facilitando su aprendizaje y preparación para exámenes.`

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

  console.log(
    'prompt',
    prompt,
    'transcription',
    transcription,
    'textPdf',
    textPdf
  )
  const { textStream } = await streamText({
    model: google('models/gemini-1.5-flash-latest'),
    system: systemPrompt,
    prompt: userPrompt
  })

  return { textStream }
}

export async function generateImportantEvents({
  prompt = 'Lista de cosas importantes',
  transcription,
  textPdf
}: {
  prompt?: string;
  transcription?: string;
  textPdf?: string;
}) {
  'use server';

  // Inicialización de un valor que puede ser actualizado de manera streamable
  const stream = createStreamableValue();

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

    Si no hay transcripción ni PDF disponibles, genera eventos genéricos relacionados con una clase universitaria típica.
    `;

  let userPrompt = prompt + '\n\n';

  if (transcription) {
    userPrompt += `Transcripción del docente: ${transcription}\n\n`;
  }

  if (textPdf) {
    userPrompt += `Contenido del PDF de la clase: ${textPdf}\n\n`;
  }

  const schema = z.object({
    importantEvents: z.array(
      z.object({
        title: z.string().describe('Título breve del evento o recordatorio'),
        description: z.string().describe('Descripción detallada del evento o recordatorio'),
        date: z.string().describe('Fecha del evento en formato DD/MM/YYYY o "Por determinar" si no se especifica'),
        priority: z.enum(['Alta', 'Media', 'Baja']).describe('Prioridad del evento'),
      }),
    ),
  });
  
  // Procesamiento del stream y actualización del valor streamable
  (async () => {
  const { partialObjectStream } = await streamObject({
    model: google('models/gemini-1.5-flash-latest'),
    system: systemPrompt,
    prompt: userPrompt,
    schema: schema,
  });


    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }

    stream.done();
  })();

  return { object: stream.value };
}