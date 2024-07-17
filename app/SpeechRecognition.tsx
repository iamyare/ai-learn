import React, { useState, useEffect, useCallback, useRef } from 'react';

interface DialogEntry {
  timestamp: string;
  text: string;
}

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [history, setHistory] = useState<DialogEntry[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
  }, []);

  const addToHistory = useCallback((text: string) => {
    if (text.trim() !== '') {
      setHistory((prevHistory) => {
        const lastEntry = prevHistory[prevHistory.length - 1];
        if (lastEntry && lastEntry.text === text.trim()) {
          return prevHistory; // No añadir si es exactamente igual a la última entrada
        }
        return [
          ...prevHistory,
          { timestamp: formatTimestamp(new Date()), text: text.trim() }
        ];
      });
      setTranscript('');
    }
  }, []);

  const startListening = useCallback(() => {
    setIsListening(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';

    let currentTranscript = '';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript !== '') {
        currentTranscript += finalTranscript;
        setTranscript(currentTranscript);
        addToHistory(currentTranscript);
        currentTranscript = '';
      } else {
        setTranscript(currentTranscript + interimTranscript);
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (currentTranscript !== '') {
          addToHistory(currentTranscript);
          currentTranscript = '';
        }
      }, 1000);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      } else {
        setTranscript('');
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      if (isListening) {
        recognition.stop();
        setTimeout(() => recognition.start(), 1000); // Reiniciar después de 1 segundo
      }
    };

    recognition.start();
    recognitionRef.current = recognition;

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      recognition.stop();
      setIsListening(false);
    };
  }, [isListening, addToHistory, stopListening]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  return { isListening, transcript, history, startListening, stopListening };
};

const SpeechRecognition: React.FC = () => {
  const { isListening, transcript, history, startListening, stopListening } = useSpeechRecognition();

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
        <div className="mt-2 p-2 flex flex-col gap-2  rounded whitespace-pre-wrap">
          {history.map((entry, index) => (
            <p key={index}>
                <span className=' ml-2 text-muted-foreground text-sm'>{entry.timestamp}{'\n'}</span>
              {entry.text}
              {/* {index < history.length - 1 ? '\n' : ''} */}
            </p>

          ))}
          {
            isListening ? (
                <p>
                    {transcript}
                    {' '}
                    <span>...</span>
                </p>
            ): null
          }
        </div>
      </div>
    </div>
  );
};

export default SpeechRecognition;