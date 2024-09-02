'use server'

import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'

export async function generateChartFromHighlight({
  highlightedText,
  apiKey,
  chartType
}: {
  highlightedText: string
  apiKey: string
  chartType?: 'bar' | 'line' | 'pie' | 'scatter' | 'area'
}) {
  'use server'

  const google = createGoogleGenerativeAI({
    apiKey: apiKey ?? ''
  })

  const systemPrompt = `
    Eres un asistente especializado en analizar texto y generar datos para gráficos.
    Tu tarea es analizar el texto resaltado proporcionado y generar datos para un gráfico
    que represente la información de manera visual.

    Reglas para la generación de datos del gráfico:
    - Analiza el texto resaltado y extrae la información más relevante.
    - Genera datos numéricos basados en la información proporcionada.
    - Si no hay datos numéricos explícitos, haz una interpretación razonable basada en el contexto.
    - Proporciona un título descriptivo para el gráfico.
    - Si se especifica un tipo de gráfico, úsalo. Si no, sugiere el tipo de gráfico más adecuado.
    - Genera etiquetas apropiadas para los ejes X e Y (si aplica).
    - Limita los datos a un máximo de 5-7 puntos para mantener el gráfico claro y conciso.
  `

  const userPrompt = `Texto resaltado: ${highlightedText}${chartType ? ` Tipo de gráfico solicitado: ${chartType}` : ''}`

  const schema = z.object({
    chartData: z.object({
      title: z.string().describe('Título descriptivo del gráfico'),
      type: z.enum(['bar', 'line', 'pie', 'scatter', 'area']).describe('Tipo de gráfico'),
      labels: z.array(z.string()).describe('Etiquetas para los datos (eje X en gráficos de barras o líneas)'),
      datasets: z.array(z.object({
        label: z.string().describe('Etiqueta para el conjunto de datos'),
        data: z.array(z.number()).describe('Valores numéricos para el gráfico')
      })),
      xAxisLabel: z.string().optional().describe('Etiqueta para el eje X (si aplica)'),
      yAxisLabel: z.string().optional().describe('Etiqueta para el eje Y (si aplica)')
    })
  })

  try {
    const { object } = await generateObject({
      model: google('models/gemini-1.5-flash-latest'),
      system: systemPrompt,
      prompt: userPrompt,
      schema: schema
    })

    return { chartData: object.chartData }
  } catch (error) {
    console.error('Error al generar los datos del gráfico:', error)
    return { chartData: null }
  }
}


export async function explainText({
  highlightedText,
  apiKey
}: {
  highlightedText: string
  apiKey: string
}) {
  'use server'

  const google = createGoogleGenerativeAI({
    apiKey: apiKey ?? ''
  })

  const systemPrompt = `
    Eres un asistente educativo especializado en explicar conceptos de manera clara y concisa.
    Tu tarea es proporcionar una explicación breve pero completa del texto resaltado.
    
    Reglas para la explicación:
    - Mantén la explicación clara y concisa, limitándola a 2-3 oraciones.
    - Enfócate en los conceptos clave y su importancia.
    - Usa un lenguaje sencillo y accesible.
    - Si el texto contiene términos técnicos, proporciona definiciones breves.
  `

  const userPrompt = `Explica el siguiente texto: ${highlightedText}`

  const schema = z.object({
    explanation: z.string().describe('Explicación concisa del texto resaltado')
  })

  try {
    const { object } = await generateObject({
      model: google('models/gemini-1.5-flash-latest'),
      system: systemPrompt,
      prompt: userPrompt,
      schema: schema
    })
    return {explanation: {context: highlightedText, explanation: object.explanation}}
  } catch (error) {
    console.error('Error al generar la explicación:', error)
    return null
  }
}

export async function translateText({
  highlightedText,
  apiKey,
  targetLanguage = 'español'
}: {
  highlightedText: string
  apiKey: string
  targetLanguage?: string
}) {
  'use server'

  const google = createGoogleGenerativeAI({
    apiKey: apiKey ?? ''
  })

  const systemPrompt = `
    Eres un traductor experto. Tu tarea es detectar automáticamente el idioma del texto proporcionado y traducirlo al idioma de destino especificado.
    
    Reglas para la traducción:
    - Detecta automáticamente el idioma del texto proporcionado.
    - Mantén el significado y el tono del texto original.
    - Adapta las expresiones idiomáticas si es necesario.
    - Mantén los términos técnicos en su forma original si no tienen una traducción establecida.
  `

  const userPrompt = `Detecta el idioma del siguiente texto y luego tradúcelo al ${targetLanguage}: ${highlightedText}`

  const schema = z.object({
    translation: z.string().describe(`Traducción al ${targetLanguage} del texto resaltado`),
    detectedLanguage: z.string().describe('Idioma detectado del texto original')
  })

  try {
    const { object } = await generateObject({
      model: google('models/gemini-1.5-flash-latest'),
      system: systemPrompt,
      prompt: userPrompt,
      schema: schema
    })

    return {
      translation: {
        original: highlightedText,
        translated: object.translation,
        sourceLanguage: object.detectedLanguage,
        targetLanguage
      }
    }
  } catch (error) {
    console.error('Error al generar la traducción:', error)
    return null
  }
}