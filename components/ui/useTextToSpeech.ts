import { useState, useEffect, useCallback, useRef } from 'react';

type SpeechSynthesisLanguage = 'ar-SA' | 'cs-CZ' | 'da-DK' | 'de-DE' | 'el-GR' | 'en-AU' | 'en-GB' | 'en-IE' | 'en-IN' | 'en-US' | 'en-ZA' | 'es-AR' | 'es-ES' | 'es-MX' | 'es-US' | 'fi-FI' | 'fr-CA' | 'fr-FR' | 'he-IL' | 'hi-IN' | 'hu-HU' | 'id-ID' | 'it-IT' | 'ja-JP' | 'ko-KR' | 'nl-BE' | 'nl-NL' | 'no-NO' | 'pl-PL' | 'pt-BR' | 'pt-PT' | 'ro-RO' | 'ru-RU' | 'sk-SK' | 'sv-SE' | 'th-TH' | 'tr-TR' | 'zh-CN' | 'zh-HK' | 'zh-TW';

interface UseTextToSpeechProps {
  text: string;
  lang?: SpeechSynthesisLanguage;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}

interface UseTextToSpeechReturn {
  speak: (startIndex?: number) => void;
  pause: () => void;
  stop: () => void;
  isPlaying: boolean;
  currentPosition: number;
  getVoices: () => SpeechSynthesisVoice[];
}

const useTextToSpeech = ({
  text,
  lang = 'es-MX',
  rate = 1,
  pitch = 1,
  volume = 1,
  voice,
}: UseTextToSpeechProps): UseTextToSpeechReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const handleVoicesChanged = () => {
      setVoices(synth.getVoices());
    };

    synth.addEventListener('voiceschanged', handleVoicesChanged);
    handleVoicesChanged();

    return () => {
      synth.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, []);

  useEffect(() => {
    const synth = window.speechSynthesis;
    utteranceRef.current = new SpeechSynthesisUtterance();
    utteranceRef.current.lang = lang;
    utteranceRef.current.rate = rate;
    utteranceRef.current.pitch = pitch;
    utteranceRef.current.volume = volume;

    const userAgent = navigator.userAgent.toLowerCase();
    const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome');

    if (!voice) {
      if (isSafari) {
        const safariVoice = voices.find(v => v.lang === lang && v.name.includes('Paulina'));
        utteranceRef.current.voice = safariVoice || voices[0];
      } else {
        const naturalVoice = voices.find(v => v.lang === lang && v.name.includes('Natural'));
        utteranceRef.current.voice = naturalVoice || voices[0];
      }
    } else {
      utteranceRef.current.voice = voice;
    }

    utteranceRef.current.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentPosition(event.charIndex + event.charLength);
      }
    };

    utteranceRef.current.onend = () => {
      setIsPlaying(false);
      setCurrentPosition(0);
    };

    return () => {
      synth.cancel();
    };
  }, [lang, rate, pitch, volume, voice, voices]);

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

  const getVoices = useCallback((): SpeechSynthesisVoice[] => {
    return window.speechSynthesis.getVoices();
  }, []);

  return { speak, pause, stop, isPlaying, currentPosition, getVoices };
};

export default useTextToSpeech;