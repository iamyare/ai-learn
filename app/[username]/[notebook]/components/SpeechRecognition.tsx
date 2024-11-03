import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { TranscriptionContent } from './TranscriptionContent'
import TranscriptionControls from './TranscriptionControls'
import TranscriptionHeader from './TranscriptionHeader'
import { useSpeechRecognitionState } from './useSpeechRecognitionState'
import { useAudioControl } from './useAudioControl'
import { AudioDropzone } from './AudioDropZone'

interface SpeechRecognitionProps {
  classNameContainer?: string
  classNameHeader?: string
  classNameTranscript?: string
  notebookId: string
}

export default function SpeechRecognition({
  classNameContainer,
  classNameTranscript,
  notebookId
}: SpeechRecognitionProps) {
  const {
    isListening,
    transcript,
    history,
    isPending,
    isPendingTranscription,
    isLoading,
    isUpdated,
    lastUpdateTime,
    showPageNumbers,
    visualizationOptions,
    setIsPendingTranscription,
    setShowPageNumbers,
    handleAction
  } = useSpeechRecognitionState(notebookId)

  const fullText = history.map((entry) => entry.text).join(' ') + ' ' + transcript
  const {
    currentPosition,
    isPlaying,
    stop,
    handlePositionChange,
    handleTTSAction
  } = useAudioControl(fullText)

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
      // Lógica de scroll si es necesaria
    }
  }

  return (
    <section className={cn('flex flex-col h-full w-full', classNameContainer)}>
      <div className="flex justify-between items-center">
        <span></span>
        <TranscriptionControls
          isListening={isListening}
          isPlaying={isPlaying}
          isPending={isPending}
          onMicClick={handleAction}
          onPlayPauseClick={handleTTSAction}
          onStopClick={stop}
          showPageNumbers={showPageNumbers}
          onTogglePageNumbers={() => setShowPageNumbers(!showPageNumbers)}
        />
        <TranscriptionHeader
          isUpdated={isUpdated}
          lastUpdateTime={lastUpdateTime}
        />
      </div>
      <AudioDropzone
        isLoading={isLoading}
        isListening={isListening}
        onTranscriptionStart={() => setIsPendingTranscription(true)}
        isPendingTranscription={isPendingTranscription}
      >
        <aside
          className={cn(
            'w-full h-full px-4 overflow-y-auto relative transcript-scroll-area',
            classNameTranscript
          )}
          ref={scrollAreaRef}
          onScroll={handleScroll}
        >
          <TranscriptionContent
            isLoading={isLoading}
            history={history}
            transcript={transcript}
            isListening={isListening}
            currentPosition={currentPosition}
            onPositionChange={handlePositionChange}
            visualizationOptions={visualizationOptions}
            showPageNumbers={showPageNumbers}
            isPlaying={isPlaying}
          />
        </aside>
      </AudioDropzone>
    </section>
  )
}