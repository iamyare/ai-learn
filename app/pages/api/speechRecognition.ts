// pages/api/speechRecognition.ts
import { NextApiRequest, NextApiResponse } from 'next';
import * as DeepSpeech from 'deepspeech';
import * as path from 'path';

// Cargar el modelo de DeepSpeech (asegúrate de tener estos archivos en tu proyecto)
const modelPath = path.join(process.cwd(), 'path/to/deepspeech-0.9.3-models.pbmm');
const scorerPath = path.join(process.cwd(), 'path/to/deepspeech-0.9.3-models.scorer');

let model: DeepSpeech.Model | null = null;

if (!model) {
  model = new DeepSpeech.Model(modelPath);
  model.enableExternalScorer(scorerPath);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { audio } = req.body; // Espera que el audio sea un ArrayBuffer

      // Convertir el ArrayBuffer a un Buffer
      const buffer = Buffer.from(audio);

      // Realizar el reconocimiento de voz
      const result = model?.stt(buffer);

      res.status(200).json({ transcription: result });
    } catch (error) {
      console.error('Error en el reconocimiento de voz:', error);
      res.status(500).json({ error: 'Error en el servidor de reconocimiento de voz' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}