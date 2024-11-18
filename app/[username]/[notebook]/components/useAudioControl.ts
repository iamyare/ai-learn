import { useState, useEffect } from 'react'
import useTextToSpeech from '@/components/ui/useTextToSpeech'

export const useAudioControl = (text: string) => {
  const [currentPosition, setCurrentPosition] = useState(1)
  const [lastPlayPosition, setLastPlayPosition] = useState(1)

  const {
    speak,
    pause,
    stop,
    isPlaying,
    currentPosition: ttsPosition
  } = useTextToSpeech({ text })

  useEffect(() => {
    setCurrentPosition(ttsPosition)
  }, [ttsPosition])

  useEffect(() => {
    if (isPlaying) {
      setCurrentPosition(ttsPosition + lastPlayPosition)
    }
  }, [ttsPosition, isPlaying, lastPlayPosition])

  const handlePositionChange = (newPosition: number) => {
    setCurrentPosition(newPosition)
    setLastPlayPosition(newPosition)
  }

  const handleTTSAction = () => {
    if (isPlaying) {
      pause()
    } else {
      setLastPlayPosition(currentPosition)
      speak(currentPosition )
    }
  }

  return {
    currentPosition,
    isPlaying,
    stop,
    handlePositionChange,
    handleTTSAction
  }
}
