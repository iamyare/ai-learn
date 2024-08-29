import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTextToSpeechProps {
  text: string;
  lang?: string;
  rate?: number;
  pitch?: number;
}

interface UseTextToSpeechReturn {
  speak: (startIndex?: number) => void;
  pause: () => void;
  stop: () => void;
  isPlaying: boolean;
  currentPosition: number;
}

const useTextToSpeech = ({
  text,
  lang = 'es-ES',
  rate = 1,
  pitch = 1,
}: UseTextToSpeechProps): UseTextToSpeechReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    utteranceRef.current = new SpeechSynthesisUtterance();
    utteranceRef.current.lang = lang;
    utteranceRef.current.rate = rate;
    utteranceRef.current.pitch = pitch;

    utteranceRef.current.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentPosition(event.charIndex);
      }
    };

    utteranceRef.current.onend = () => {
      setIsPlaying(false);
      setCurrentPosition(0);
    };

    return () => {
      synth.cancel();
    };
  }, [lang, rate, pitch]);

  const speak = useCallback((startIndex = 0) => {
    const synth = window.speechSynthesis;
    if (utteranceRef.current) {
      if (synth.speaking) {
        synth.cancel();
      }
      utteranceRef.current.text = textRef.current.slice(startIndex);
      synth.speak(utteranceRef.current);
      setIsPlaying(true);
      setCurrentPosition(startIndex);
    }
  }, []);

  const pause = useCallback(() => {
    const synth = window.speechSynthesis;
    synth.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPlaying(false);
    setCurrentPosition(0);
  }, []);

  return { speak, pause, stop, isPlaying, currentPosition };
};

export default useTextToSpeech;