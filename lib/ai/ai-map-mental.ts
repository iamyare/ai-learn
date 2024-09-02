'use server'

import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'

function removeParentheses(mindMapObject: { mindMap: string }): { mindMap: string } {
    const lines = mindMapObject.mindMap.split('\n');
    const modifiedLines = lines.map((line, index) => {
        if (index === 1 || line.includes('::icon')) {
            // Mantener los paréntesis en el nodo root y en los iconos
            return line;
        }
        // Eliminar todos los paréntesis en las demás líneas
        return line.replace(/[(){}]/g, '');
    });
    return { mindMap: modifiedLines.join('\n') };
}


export async function generateMindMap({
  prompt = 'Crea un mapa mental',
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
    Eres un asistente educativo especializado en crear mapas mentales utilizando la sintaxis de Mermaid.
    Tu tarea es generar un mapa mental basado en la información proporcionada, siguiendo estas pautas:

    1. Utiliza la información de la transcripción del docente (si está disponible) como fuente principal.
    2. Complementa con el contenido del PDF de la clase si es necesario.
    3. Considera la pregunta o instrucción específica del estudiante.

    Reglas para el mapa mental:
    - Utiliza la sintaxis de Mermaid para mindmaps.
    - Crea un nodo principal con el tema central.
    - Añade nodos secundarios para subtemas principales.
    - Incluye nodos terciarios para detalles importantes.
    - Limita el mapa a un máximo de 3 niveles de profundidad para mantenerlo claro y conciso.
    - Solo los root y ::icon puede contener parentesis, en lo demas se deberan de eliminar parentesis, llaves, y demas que perjudique la sintaxis.
    - La eliminación de parentesis, llaves, debe de ser obligatoria en los nodos.
    - No seas redundante, utiliza la información más relevante.
    - No debe de ser demasiado extenso, mantén la información clave.
    - Solo incluye información relevante y significativa, máximo 5 detalles por nodo.
    - El mapa mental debe ser claro y fácil de entender.
    - Máximo 5 nodos en total.
    - en palabras clasves utiliza iconos y el texto para mejorar la visualización y comprensión del mapa mental.
    - Asegúrate de que el formato sea el siguiente:

        mindmap
        root((mindmap))
            Subtema 1
            Detalle 1
            ::icon(fa fa-book)
            Detalle 2
                Detalle 2.1
            Subtema 2
                Detalle 1
                Detalle 2
  `

  let userPrompt = prompt + '\n\n'

  if (transcription) {
    userPrompt += `Transcripción del docente: ${transcription}\n\n`
  }

  if (textPdf) {
    userPrompt += `Contenido del PDF de la clase: ${textPdf}\n\n`
  }

  const schema = z.object({
    mindMap: z.string().describe('Diagrama de mapa mental en sintaxis Mermaid')
  })

  try {
    const { object } = await generateObject({
      model: google('models/gemini-1.5-flash-latest'),
      system: systemPrompt,
      prompt: userPrompt,
      schema: schema,
    })


    const modifiedObject = removeParentheses(object)
    return { mindMap: modifiedObject.mindMap }
  } catch (error) {
    console.error('Error al generar el mapa mental:', error)
    return { mindMap: 'mindmap\n  root((Información insuficiente))' }
  }
}