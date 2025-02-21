export interface AiMessage {
  role: 'user' | 'assistant'
  content: string | Array<{ type: string; text?: string; file?: { type: string; data: ArrayBuffer } }>
}

export interface AiStreamParams {
  prompt: string
  transcription?: string
  messageHistory: AiMessage[]
  apiKey: string
  pdfBuffer?: ArrayBuffer | null
  existingCacheId?: string
}

export interface AiStreamResponse {
  content: string
  newCacheId?: string
}