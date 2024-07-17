import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY ?? '',
});
import { streamText } from 'ai'

export async function aiStream({ prompt, transcription }: { prompt: string, transcription: string }) {
  const { textStream } = await streamText({
    model: google('models/gemini-1.5-flash-latest'),
    prompt: `${prompt} \n\n${transcription}`
  })

  return {textStream}
}
