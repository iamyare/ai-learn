import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { TranscriptionContent } from './TranscriptionContent'
import TranscriptionControls from './TranscriptionControls'
import TranscriptionHeader from './TranscriptionHeader'
import { useSpeechRecognitionState } from './useSpeechRecognitionState'
import { useAudioControl } from './useAudioControl'
import { AudioDropzone } from './AudioDropZone'
import { ScrollArea } from '@/components/ui/scroll-area'

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
  const scrollRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  
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

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current && shouldAutoScroll) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: 'smooth'
        })
      }
    }
  }, [shouldAutoScroll])

  useEffect(() => {
    if (isListening || isPlaying) {
      scrollToBottom()
    }
  }, [isListening, isPlaying, transcript, currentPosition, scrollToBottom])

  return (
    <section className={cn('flex flex-col h-full w-full overflow-hidden', classNameContainer)}>
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
      <aside
        className={cn(
          'w-full h-full px-4 flex overflow-hidden relative',
          classNameTranscript
        )}
      >
        <AudioDropzone
          isLoading={isLoading}
          isListening={isListening}
          onTranscriptionStart={() => setIsPendingTranscription(true)}
          isPendingTranscription={isPendingTranscription}
        >
          <ScrollArea
            className='max-h-full h-full'
            ref={scrollRef}
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
          </ScrollArea>
        </AudioDropzone>
      </aside>
    </section>
  )
}