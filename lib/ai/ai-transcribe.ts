import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

interface DialogEntry {
  timestamp: string;
  text: string;
  page?: number;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer);
  let binary = '';
  uint8Array.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary);
}

// Schema para Gemini
const geminiSchema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      timestamp: {
        type: SchemaType.STRING,
        description: "Timestamp in HH:MM:SS format"
      },
      text: {
        type: SchemaType.STRING,
        description: "Transcribed text"
      },
      page: {
        type: SchemaType.NUMBER,
        description: "Page number (optional)",
        optional: true
      }
    },
    required: ["timestamp", "text"]
  }
};

export async function transcribeAudio({
  audioFile,
  apiKey
}: {
  audioFile: File;
  apiKey: string;
}): Promise<DialogEntry[]> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: geminiSchema
      }
    });

    const audioData = await audioFile.arrayBuffer();
    const base64Audio = arrayBufferToBase64(audioData);

    const prompt = "Transcribe este audio y devuelve un array de objetos JSON. " +
                  "Cada objeto debe tener 'timestamp' en formato HH:MM:SS y 'text' con el texto transcrito.";

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: audioFile.type,
          data: base64Audio
        }
      },
      { text: prompt }
    ]);

    const responseText = result.response.text();
    return JSON.parse(responseText) as DialogEntry[];

  } catch (error) {
    console.error('Error al transcribir el audio:', error);
    return [];
  }
}