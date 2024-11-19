import { cn } from '@/lib/utils'
import { TranscriptionContent } from './TranscriptionContent'
import TranscriptionControls from './TranscriptionControls'
import TranscriptionHeader from './TranscriptionHeader'
import { useSpeechRecognitionState } from './useSpeechRecognitionState'
import { useAudioControl } from './useAudioControl'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { ArrowDown } from 'lucide-react'
import { AudioDropzone } from './AudioDropzone'
import { useScroll } from './useScroll'
import { useExportStore } from '@/stores/useExportStore'
import { useEffect } from 'react'

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

  const fullText =
    history.map((entry) => entry.text).join(' ') + ' ' + transcript
  const {
    currentPosition,
    isPlaying,
    stop,
    handlePositionChange,
    handleTTSAction
  } = useAudioControl(fullText)

  const { scrollRef, shouldAutoScroll, scrollToPosition } = useScroll(
    isListening,
    transcript,
    isPlaying,
    currentPosition
  )

  const setTranscriptions = useExportStore((state) => state.setTranscriptions)

  useEffect(() => {
    const transcriptions = history.map((entry) => entry.text)
    setTranscriptions(transcriptions)
  }, [history, setTranscriptions])

  return (
    <section
      className={cn(
        'flex flex-col h-full w-full overflow-hidden',
        classNameContainer
      )}
    >
      <div className='flex justify-between items-center'>
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
          onTranscriptionStart={setIsPendingTranscription}
          isPendingTranscription={isPendingTranscription}
          notebookId={notebookId}
        >
          <ScrollArea className='max-h-full h-full' ref={scrollRef}>
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

        {!shouldAutoScroll && (isPlaying || isListening) && (
          <Button
            size='icon'
            variant='outline'
            className='absolute bottom-4 right-4 rounded-full shadow-lg p-2 size-fit aspect-square'
            onClick={scrollToPosition}
          >
            <ArrowDown className='size-4' />
          </Button>
        )}
      </aside>
    </section>
  )
}
