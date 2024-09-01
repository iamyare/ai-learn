import { aiStream } from '@/lib/ai'

export const processUserMessage = async (
  userMessage: string,
  apiKey: string,
  transcript: string,
  textPdf: string,
  messageHistory: { role: string; content: string }[],
  updateMessages: (updater: (prev: ChatMessageType[]) => ChatMessageType[]) => void
) => {
  try {
    const { textStream } = await aiStream({
      prompt: userMessage ?? 'Realiza un resumen de todo el contenido',
      transcription: transcript,
      textPdf: textPdf,
      messageHistory: messageHistory,
      apiKey: apiKey
    })

    let aiResponse = ''
    for await (const text of textStream) {
      aiResponse += text
      updateMessages((prev) => {
        const updatedMessages = [...prev]
        const lastMessage = updatedMessages[updatedMessages.length - 1]
        if (!lastMessage.isUser && 'content' in lastMessage) {
          lastMessage.content = aiResponse
        } else {
          updatedMessages.push({
            content: aiResponse,
            isUser: false,
            timestamp: new Date().toISOString()
          })
        }
        return updatedMessages
      })
    }
  } catch (err) {
    console.error('Error en el flujo de AI:', err)
    throw err
  }
}