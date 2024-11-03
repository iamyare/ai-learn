import { TranscriptionSkeleton } from '@/components/skeletons'
import { CoursorText } from '@/components/ui/coursor-text'
import TranscriptionList from './TranscriptionList'

interface TranscriptionContentProps {
  isLoading: boolean
  history: any[]
  transcript: string
  isListening: boolean
  currentPosition: number
  onPositionChange: (position: number) => void
  visualizationOptions: any
  showPageNumbers: boolean
  isPlaying: boolean
}

export const TranscriptionContent = ({
  isLoading,
  history,
  transcript,
  isListening,
  currentPosition,
  onPositionChange,
  visualizationOptions,
  showPageNumbers,
  isPlaying
}: TranscriptionContentProps) => {
  if (isLoading) return <TranscriptionSkeleton />
  
  if (history.length !== 0) {
    return (
      <TranscriptionList
        history={history}
        transcript={transcript}
        isListening={isListening}
        currentPosition={currentPosition}
        onPositionChange={onPositionChange}
        visualizationOptions={visualizationOptions}
        showPageNumbers={showPageNumbers}
        isPlaying={isPlaying}
      />
    )
  }

  if (isListening) {
    return (
      <div className="flex h-full">
        <span>
          {transcript}
          <CoursorText />
        </span>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center h-full">
      <p className="text-muted-foreground">
        No hay transcripciones disponibles. Comienza a hablar para crear una.
      </p>
    </div>
  )
}