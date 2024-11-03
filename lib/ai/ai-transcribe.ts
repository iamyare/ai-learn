import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from 'zod';

interface DialogEntry {
  timestamp: string;
  text: string;
  page?: number;
}

export async function transcribeAudio({
  audioFile,
  apiKey
}: {
  audioFile: File;
  apiKey: string;
}): Promise<DialogEntry[]> {
  try {
    // Inicializar el cliente de Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Configurar el modelo
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // Preparar el archivo y el prompt
    const fileData = {
      mimeType: audioFile.type,
      data: await audioFile.arrayBuffer()
    };

    const prompt = "Por favor, transcribe este audio y genera una lista de entradas de diálogo. " +
                  "Cada entrada debe incluir una marca de tiempo en formato HH:MM:SS y el texto transcrito.";

    // Generar la transcripción
    const result = await model.generateContent([
      {
        fileData: fileData
      },
      { text: prompt }
    ]);

    const transcription = await result.response.text();

    // Procesar la respuesta en formato DialogEntry
    const entries = transcription.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const timestampMatch = line.match(/(\d{2}:\d{2}:\d{2})/);
        const timestamp = timestampMatch ? timestampMatch[0] : "00:00:00";
        const text = line.replace(timestamp, '').trim();
        
        return {
          timestamp,
          text
        } as DialogEntry;
      });

    return entries;

  } catch (error) {
    console.error('Error al transcribir el audio:', error);
    return [];
  }
}