import React, { useState, useEffect, useCallback, useRef } from 'react';

interface DialogEntry {
  timestamp: string;
  text: string;
}

const SpeechRecognition: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [history, setHistory] = useState<DialogEntry[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatTimestamp = (date: Date): string => {
    return date.toISOString().slice(11, 23);
  };

  const stopListening = useCallback(() => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
  }, []);

  const addToHistory = useCallback((text: string) => {
    if (text.trim() !== '') {
      setHistory((prevHistory) => {
        const lastEntry = prevHistory[prevHistory.length - 1];
        if (lastEntry && lastEntry.text === text.trim()) {
          return prevHistory; // No añadir si es exactamente igual a la última entrada
        }
        if (lastEntry && text.trim().startsWith(lastEntry.text)) {
          // Si la nueva entrada comienza con la anterior, reemplazar la anterior
          return [
            ...prevHistory.slice(0, -1),
            { timestamp: formatTimestamp(new Date()), text: text.trim() }
          ];
        }
        return [
          ...prevHistory,
          { timestamp: formatTimestamp(new Date()), text: text.trim() }
        ];
      });
    }
  }, []);

  const startListening = useCallback(() => {
    setIsListening(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';

    let finalTranscript = '';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      setTranscript(finalTranscript + interimTranscript);

      if (finalTranscript !== '') {
        addToHistory(finalTranscript);
        finalTranscript = '';
      } else if (interimTranscript !== '') {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          addToHistory(interimTranscript);
        }, 1000);
      }

      // Reiniciar el temporizador de silencio
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = setTimeout(() => {
        if (isListening) {
          stopListening();
          setIsListening(false);
        }
      }, 5000); // Detener después de 5 segundos de silencio
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      if (isListening) {
        recognition.stop();
        setTimeout(() => recognition.start(), 1000);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      recognition.stop();
      setIsListening(false);
    };
}, [isListening, addToHistory, stopListening]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);



  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reconocimiento de Voz</h1>
      <div className="flex space-x-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } text-white`}
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? 'Detener' : 'Iniciar'} Reconocimiento
        </button>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Transcripción en tiempo real:</h2>
        <p className="mt-2 p-2 bg-gray-100 rounded">{transcript}</p>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Historial:</h2>
        <pre className="mt-2 p-2 bg-gray-100 rounded whitespace-pre-wrap">
          {history.map((entry, index) => (
            `[${entry.timestamp}] ${entry.text}${index < history.length - 1 ? '\n' : ''}`
          )).join('')}
        </pre>
      </div>
    </div>
  );
};

export default SpeechRecognition;