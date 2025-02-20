import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText } from 'ai'
import { logger } from '@/lib/utils/logger'

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimatedCost: number // en USD
}

export interface GeminiResponse {
  content: string
  tokenUsage: TokenUsage
}

export class GeminiService {
  private client: ReturnType<typeof createGoogleGenerativeAI>
  private readonly COST_PER_1K_TOKENS = 0.0005

  constructor(apiKey: string) {
    this.client = createGoogleGenerativeAI({ apiKey })
  }

  private calculateCost(tokens: number): number {
    return (tokens / 1000) * this.COST_PER_1K_TOKENS
  }

  async generateStreamingContent(params: {
    prompt: string
    systemPrompt?: string
    temperature?: number
    maxTokens?: number
    stopSequences?: string[]
    pdfBuffer?: ArrayBuffer | null
  }) {
    const {
      prompt,
      systemPrompt,
      temperature = 0.7,
      maxTokens,
      stopSequences,
      pdfBuffer
    } = params

    try {
      logger.info('Starting streaming content generation', { 
        promptPreview: prompt.substring(0, 100) + '...',
        temperature,
        maxTokens,
        hasPDF: !!pdfBuffer
      })
      
      const startTime = Date.now()
      const model = this.client('models/gemini-1.5-flash-002')
      
      const content: any[] = [{ type: 'text', text: prompt }]
      if (pdfBuffer) {
        content.push({
          type: 'file',
          mimeType: 'application/pdf',
          data: pdfBuffer
        })
      }

      let tokenUsage: TokenUsage | null = null
      
      const { textStream } = await streamText({
        model,
        messages: [{
          role: 'user',
          content
        }],
        system: systemPrompt,
        temperature,
        maxTokens,
        stopSequences,
        onFinish: ({usage}) => {
          tokenUsage = {
            promptTokens: usage.promptTokens,
            completionTokens: usage.completionTokens,
            totalTokens: usage.totalTokens,
            estimatedCost: this.calculateCost(usage.totalTokens)
          }
          
          const endTime = Date.now()
          logger.info('Streaming completed', {
            duration: endTime - startTime,
            tokens: usage.totalTokens,
            cost: tokenUsage.estimatedCost
          })
        }
      })

      if (!textStream) {
        throw new Error('No se pudo iniciar el stream de texto')
      }

      return {
        stream: textStream,
        getTokenUsage: () => tokenUsage
      }
    } catch (error) {
      logger.error('Error in streaming content', {
        error: error instanceof Error ? error.message : 'Unknown error',
        promptPreview: prompt.substring(0, 100) + '...'
      })
      throw this.handleError(error)
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      if (error.message.includes('quota')) {
        return new Error('Se ha excedido la cuota de la API')
      }
      if (error.message.includes('invalid')) {
        return new Error('La API key no es válida')
      }
      if (error.message.includes('permission')) {
        return new Error('No tienes permisos para usar este modelo')
      }
      if (error.message.includes('rate')) {
        return new Error('Has excedido el límite de solicitudes por minuto')
      }
      if (error.message.includes('file')) {
        return new Error('Error al procesar el archivo PDF')
      }
      return error
    }
    return new Error('Error desconocido al generar contenido')
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const { stream } = await this.generateStreamingContent({
        prompt: 'test',
        maxTokens: 1
      })
      for await (const _ of stream) {
        // Solo necesitamos verificar que el stream funciona
        break
      }
      return true
    } catch (error) {
      logger.error('API key validation failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      return false
    }
  }
}

export async function createGeminiService(apiKey: string): Promise<GeminiService> {
  if (!apiKey) {
    throw new Error('API key es requerida para crear el servicio de Gemini')
  }
  return new GeminiService(apiKey)
}

export async function withGemini<T>(
  apiKey: string,
  operation: (service: GeminiService) => Promise<T>
): Promise<T> {
  const service = await createGeminiService(apiKey)
  return operation(service)
}