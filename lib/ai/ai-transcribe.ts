import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

interface DialogEntry {
  timestamp: string; // ISO 8601 format
  text: string;
  page?: number;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer);
  let binary = '';
  uint8Array.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary);
}

function isValidDialogEntry(entry: DialogEntry): boolean {
  return entry.text.length >= 3 && 
         entry.text.trim().length > 0 &&
         /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(entry.timestamp);
}

const geminiSchema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      timestamp: {
        type: SchemaType.STRING,
        description: "Timestamp in ISO 8601 format (e.g., 2024-08-02T19:34:45.527Z)"
      },
      text: {
        type: SchemaType.STRING,
        description: "Transcribed text content"
      },
      page: {
        type: SchemaType.NUMBER,
        description: "Page number if mentioned in the audio (optional)"
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
    const fileCreationDate = new Date(audioFile.lastModified).toISOString();

    const prompt = `Transcribe este audio y devuelve un array de objetos JSON con el siguiente formato:
    - 'timestamp': Usa formato ISO 8601 (ejemplo: 2024-08-02T19:34:45.527Z). 
      Toma como referencia la fecha de creación del archivo: ${fileCreationDate}
    - 'text': El contenido transcrito completo. Incluir solo frases completas y con sentido.
      No incluir fragmentos sueltos o caracteres individuales.
    - 'page': (Opcional) Incluir solo si se menciona específicamente un número de página en el audio

    Importante:
    - Cada entrada debe contener una transcripción completa y significativa
    - Omitir fragmentos incompletos o sin sentido
    - Asegúrate de que los timestamps sean secuenciales y tengan sentido cronológico`;

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
    const entries = JSON.parse(responseText) as DialogEntry[];
    
    // Filtrar entradas inválidas
    return entries.filter(isValidDialogEntry);

  } catch (error) {
    console.error('Error al transcribir el audio:', error);
    return [];
  }
}