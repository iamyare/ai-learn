'use client'
import React, { useState, useEffect } from 'react';

type Transcript = {
  text: string;
  pause: boolean;
  time: number;
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const isSpeechRecognitionSupported = SpeechRecognition !== undefined;

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);

  useEffect(() => {
    if (isSpeechRecognitionSupported && isListening) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onstart = () => {
        console.log('La transcripción ha comenzado');
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript.trim();
        const isFinal = event.results[current].isFinal;
        const timestamp = new Date().getTime();

        setTranscripts(prevTranscripts => {
          if (prevTranscripts.length > 0) {
            const lastTranscript = prevTranscripts[prevTranscripts.length - 1];
            if (timestamp - lastTranscript.time <= 10000) {
              // If within 10 seconds, update the last transcript
              if (isFinal && lastTranscript.text !== transcriptResult) {
                // Only add new content if it's different from the last transcript
                return [
                  ...prevTranscripts.slice(0, -1),
                  { 
                    text: lastTranscript.text + (lastTranscript.text.endsWith(transcriptResult) ? '' : ' ' + transcriptResult), 
                    pause: false, 
                    time: timestamp 
                  }
                ];
              } else {
                // Update the last transcript without adding new content
                return [
                  ...prevTranscripts.slice(0, -1),
                  { ...lastTranscript, pause: !isFinal, time: timestamp }
                ];
              }
            }
          }
          // If it's a new transcript (more than 10 seconds have passed)
          return [
            ...prevTranscripts,
            { text: transcriptResult, pause: !isFinal, time: timestamp }
          ];
        });
      };

      recognition.onerror = (event) => {
        console.error('Error en la transcripción: ', event.error);
      };

      recognition.onend = () => {
        console.log('La transcripción ha finalizado');
        setIsListening(false);
      };

      recognition.start();

      return () => {
        recognition.stop();
      };
    }
  }, [isListening]);

  const handleListen = () => {
    setIsListening(true);
  };

  const formatTime = (time: number) => {
    const date = new Date(time);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {isSpeechRecognitionSupported ? (
        <>
          <button onClick={handleListen}>Habilitar micrófono</button>
          <div>
            {transcripts.filter(transcript => !transcript.pause).map((transcript, index) => (
              <p key={index}>
                [{formatTime(transcript.time)}] {transcript.text}
              </p>
            ))}
          </div>
        </>
      ) : (
        <p>La transcripción no es soportada en este navegador.</p>
      )}
    </main>
  );
}