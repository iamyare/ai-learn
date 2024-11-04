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

    const systemPrompt = `Eres un experto en crear mapas mentales educativos utilizando Mermaid.
    
OBJETIVO:
Crear un mapa mental conciso y visualmente efectivo basado en la información proporcionada.

ESTRUCTURA DEL MAPA MENTAL:
1. FORMATO BASE:
   mindmap
     root((Tema Principal))
       Subtema
         Detalle

2. REGLAS DE DISEÑO:
   - Máximo 3 niveles de profundidad
   - Máximo 4 nodos principales
   - Máximo 2-3 detalles por nodo
   - Solo usar paréntesis en: root((tema))
   - Los iconos deben usarse solo cuando sean necesarios para mejorar la comprensión: Concepto::icon(fa fa-icon)
   - Usar Markdown para énfasis: **negrita**, *cursiva*

3. USO DE ICONOS (Font Awesome 5):
   Conceptos Comunes:
   - Definiciones: ::icon(fa fa-book)
   - Ejemplos: ::icon(fa fa-lightbulb)
   - Procesos: ::icon(fa fa-cogs)
   - Fechas/Tiempo: ::icon(fa fa-clock)
   - Ideas clave: ::icon(fa fa-key)
   - Advertencias: ::icon(fa fa-exclamation-triangle)
   - Preguntas: ::icon(fa fa-question-circle)
   - Recursos: ::icon(fa fa-external-link-alt)
   - Tips: ::icon(fa fa-star)

4. FORMATO DE TEXTO:
   - Usar [\`" "\`] para texto con formato Markdown
   - Enfatizar conceptos clave con **negrita**
   - Usar *cursiva* para términos importantes
   - Incluir emojis relevantes 🎯 para puntos clave

5. ORGANIZACIÓN:
   - Agrupar información relacionada
   - Priorizar conceptos clave
   - Mantener claridad y simplicidad
   - Evitar redundancia

EJEMPLO:
mindmap
  root((mindmap))
    Orígenes
      Historia larga
      ::icon(fa fa-book)
      Popularización
        Autor británico de psicología popular Tony Buzan
    Investigación
      Sobre efectividad<br/>y características
      Sobre creación automática
    Herramientas
      Papel y lápiz
      Mermaid

EJEMPLO 2:
mindmap
    id1["\`**Root** with
a second line
Unicode works too: 🤓\`"]
      id2["\`The dog in **the** hog... a *very long text* that wraps to a new line\`"]
      id3[Regular labels still works]


RECUERDA:
- Seleccionar solo la información más relevante
- Utilizar íconos estratégicamente para mejorar comprensión
- Mantener el mapa mental conciso y fácil de entender
- Aplicar formato Markdown donde sea más efectivo
- No usar paréntesis ni llaves excepto donde se especifica`

    const userPrompt = [
        prompt,
        transcription && `TRANSCRIPCIÓN:\n${transcription}`,
        textPdf && `CONTENIDO PDF:\n${textPdf}`
    ]
        .filter(Boolean)
        .join('\n\n')

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

        return removeParentheses(object)
    } catch (error) {
        console.error('Error al generar el mapa mental:', error)
        return {
            mindMap: `mindmap
    root((Error al generar))
      Causa ::icon(fa fa-exclamation-triangle)
        [\`**Por favor**, intenta de nuevo\`]`
        }
    }
}