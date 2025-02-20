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
  private readonly COST_PER_1K_TOKENS = 0.0005 // Costo por cada 1000 tokens según la documentación de Gemini
  
  constructor(apiKey: string) {
    this.client = createGoogleGenerativeAI({ apiKey })
  }

  private calculateCost(tokens: number): number {
    return (tokens / 1000) * this.COST_PER_1K_TOKENS
  }

  private async getTokenCount(text: string): Promise<number> {
    // Estimación aproximada: 1 token ≈ 4 caracteres para idiomas basados en latín
    return Math.ceil(text.length / 4)
  }

  private async trackTokenUsage(
    promptText: string,
    completionText: string
  ): Promise<TokenUsage> {
    const promptTokens = await this.getTokenCount(promptText)
    const completionTokens = await this.getTokenCount(completionText)
    const totalTokens = promptTokens + completionTokens
    
    const usage: TokenUsage = {
      promptTokens,
      completionTokens,
      totalTokens,
      estimatedCost: this.calculateCost(totalTokens)
    }

    logger.info('Token usage tracked', { usage })
    return usage
  }

  async generateContent(params: {
    prompt: string
    systemPrompt?: string
    temperature?: number
    maxTokens?: number
    stopSequences?: string[]
  }): Promise<GeminiResponse> {
    const {
      prompt,
      systemPrompt,
      temperature = 0.7,
      maxTokens,
      stopSequences
    } = params

    try {
      logger.info('Generating content', { 
        promptPreview: prompt.substring(0, 100) + '...',
        temperature,
        maxTokens 
      })
      
      const startTime = Date.now()
      
      const model = this.client('models/gemini-1.5-flash-002')
      const { textStream } = await streamText({
        model,
        messages: [{ role: 'user', content: prompt }],
        system: systemPrompt,
        temperature,
        maxTokens,
        stopSequences
      })

      if (!textStream) {
        throw new Error('No se pudo iniciar el stream de texto')
      }

      let fullResponse = ''
      for await (const text of textStream) {
        fullResponse += text
      }

      const endTime = Date.now()
      const duration = endTime - startTime

      const tokenUsage = await this.trackTokenUsage(prompt, fullResponse)

      logger.info('Content generated successfully', {
        duration,
        tokens: tokenUsage.totalTokens,
        cost: tokenUsage.estimatedCost
      })

      return {
        content: fullResponse,
        tokenUsage
      }
    } catch (error) {
      logger.error('Error generating content', {
        error: error instanceof Error ? error.message : 'Unknown error',
        promptPreview: prompt.substring(0, 100) + '...'
      })
      throw this.handleError(error)
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      // Manejar errores específicos de la API
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
      return error
    }
    return new Error('Error desconocido al generar contenido')
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await this.generateContent({
        prompt: 'test',
        maxTokens: 1
      })
      return true
    } catch (error) {
      logger.error('API key validation failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      return false
    }
  }
}

// Funciones de utilidad para trabajar con el servicio
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