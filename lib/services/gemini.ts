import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText, CoreMessage, CoreUserMessage } from 'ai'
import { logger } from '@/lib/utils/logger'
import { GoogleAICacheManager, GoogleAIFileManager, FileState } from '@google/generative-ai/server'
import { writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import os from 'os'

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

type CacheableModels = 'models/gemini-1.5-flash-001' | 'models/gemini-1.5-flash-002'

interface MessageContent {
  type: string
  text?: string
  mimeType?: string
  data?: ArrayBuffer
}

export class GeminiService {
  private client: ReturnType<typeof createGoogleGenerativeAI>
  private cacheManager: GoogleAICacheManager
  private fileManager: GoogleAIFileManager
  private readonly COST_PER_1K_TOKENS = 0.0005
  private readonly MODEL: CacheableModels = 'models/gemini-1.5-flash-002'
  private readonly RETRY_ATTEMPTS = 3
  private readonly RETRY_DELAY = 2000 // 2 segundos

  constructor(apiKey: string) {
    this.client = createGoogleGenerativeAI({ apiKey })
    this.cacheManager = new GoogleAICacheManager(apiKey)
    this.fileManager = new GoogleAIFileManager(apiKey)
  }

  private calculateCost(tokens: number): number {
    return (tokens / 1000) * this.COST_PER_1K_TOKENS
  }

  private async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async uploadAndProcessPDF(
    pdfBuffer: ArrayBuffer,
    systemPrompt?: string,
    existingCacheId?: string
  ): Promise<string | undefined> {
    const tempPath = join(os.tmpdir(), `pdf-${Date.now()}.pdf`)
    
    try {
      // Calcular un hash para identificar el PDF
      const hash = Buffer.from(pdfBuffer).slice(0, 32).toString('hex')
      
      // Usar cache existente si está disponible
      if (existingCacheId) {
        logger.info('Using existing PDF cache', {
          pdfHash: hash,
          cacheId: existingCacheId
        })
        return existingCacheId
      }

      // Guardar temporalmente el PDF
      writeFileSync(tempPath, new Uint8Array(pdfBuffer))
      
      // Subir el PDF
      const fileResult = await this.fileManager.uploadFile(tempPath, {
        mimeType: 'application/pdf',
        displayName: `pdf-${hash.substring(0, 8)}`
      })

      if (!fileResult.file?.uri) {
        logger.warn('File upload failed - no URI returned', { pdfHash: hash })
        return undefined
      }

      // Esperar a que el archivo se procese
      let file = await this.fileManager.getFile(fileResult.file.name)
      let attempts = 0

      while (file.state === FileState.PROCESSING && attempts < this.RETRY_ATTEMPTS) {
        logger.info('Waiting for PDF processing', { 
          attempt: attempts + 1,
          pdfHash: hash
        })
        
        await this.wait(this.RETRY_DELAY)
        file = await this.fileManager.getFile(fileResult.file.name)
        attempts++
      }

      if (file.state !== FileState.ACTIVE) {
        logger.warn('PDF processing failed or timed out', {
          state: file.state,
          pdfHash: hash
        })
        return undefined
      }

      // Crear el caché solo con el archivo PDF, sin system prompt
      const cacheResult = await this.cacheManager.create({
        model: this.MODEL,
        contents: [{
          role: 'user',
          parts: [{
            fileData: {
              mimeType: 'application/pdf',
              fileUri: fileResult.file.uri
            }
          }]
        }]
      })

      if (cacheResult.name) {
        const newCacheId = cacheResult.name.split('/').pop()
        logger.info('PDF content cached', {
          pdfHash: hash,
          newCacheId
        })
        return newCacheId
      }

      return undefined
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.warn('Failed to process PDF', {
        error: errorMessage,
        errorType: error instanceof Error ? error.constructor.name : 'Unknown'
      })
      return undefined
    } finally {
      // Limpiar el archivo temporal
      try {
        unlinkSync(tempPath)
      } catch (error) {
        logger.warn('Failed to cleanup temporary PDF file', {
          path: tempPath
        })
      }
    }
  }

  async generateStreamingContent(params: {
    prompt: string
    systemPrompt?: string
    temperature?: number
    maxTokens?: number
    stopSequences?: string[]
    pdfBuffer?: ArrayBuffer | null
    existingCacheId?: string
  }) {
    const {
      prompt,
      systemPrompt,
      temperature = 0.7,
      maxTokens,
      stopSequences,
      pdfBuffer,
      existingCacheId
    } = params

    try {
      const startTime = Date.now()
      let model = this.client(this.MODEL)
      let cachedContent: string | undefined
      let streamOptions: any

      if (pdfBuffer) {
        logger.info('Processing PDF', { 
          pdfSize: Math.round(pdfBuffer.byteLength / 1024) + 'KB'
        })
        
        cachedContent = await this.uploadAndProcessPDF(pdfBuffer, systemPrompt, existingCacheId)
        
        if (cachedContent) {
          // Configuración cuando usamos caché - sin system prompt
          model = this.client(this.MODEL, {
            cachedContent: `caches/${cachedContent}`
          })
          
          streamOptions = {
            model,
            messages: [{
              role: 'user',
              content: prompt
            }],
            temperature,
            maxTokens,
            stopSequences
          }
        }
      }

      // Si no hay caché, usar configuración normal con system prompt
      if (!streamOptions) {
        const userMessage: CoreUserMessage = {
          role: 'user',
          content: prompt,
          ...(pdfBuffer ? {
            data: {
              type: 'file',
              mimeType: 'application/pdf',
              content: pdfBuffer
            }
          } : {})
        }

        streamOptions = {
          model,
          messages: [userMessage],
          temperature,
          maxTokens,
          stopSequences,
          system: systemPrompt
        }
      }

      let tokenUsage: TokenUsage | null = null
      const { textStream } = await streamText(streamOptions)

      if (!textStream) {
        throw new Error('No se pudo iniciar el stream de texto')
      }

      return {
        stream: textStream,
        getTokenUsage: () => tokenUsage,
        newCacheId: cachedContent
      }
    } catch (error) {
      logger.error('Streaming error', {
        error: error instanceof Error ? error.message : 'Unknown error'
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