import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { TranscriptionContent } from './TranscriptionContent'
import TranscriptionControls from './TranscriptionControls'
import TranscriptionHeader from './TranscriptionHeader'
import { useSpeechRecognitionState } from './useSpeechRecognitionState'
import { useAudioControl } from './useAudioControl'
import { AudioDropzone } from './AudioDropZone'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { ArrowDown } from 'lucide-react'

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


  const scrollToPosition = useCallback(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      const targetElement = document.getElementById(`active-word`)

      if (scrollElement && targetElement) {
        const scrollRect = scrollElement.getBoundingClientRect()
        const elementRect = targetElement.getBoundingClientRect()
        const elementTop = elementRect.top - scrollRect.top
        
        const targetScroll = scrollElement.scrollTop + 
          elementTop - 
          (scrollElement.clientHeight - elementRect.height) / 2

        scrollElement.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        })

        // Activar autoScroll cuando llegamos a la posición manualmente
        setShouldAutoScroll(true)
      }
    }
  }, []) // Removemos shouldAutoScroll de las dependencias

  const autoScrollToPosition = useCallback(() => {
    if (shouldAutoScroll) {
      scrollToPosition()
    }
  }, [shouldAutoScroll, scrollToPosition])



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
    const scrollTimer = setTimeout(() => {
      if (isListening || transcript) {
        scrollToBottom()
      } else if (isPlaying && currentPosition > 0) {
        autoScrollToPosition()
      }
    }, 100)

    return () => clearTimeout(scrollTimer)
  }, [isListening, isPlaying, transcript, currentPosition, scrollToBottom, autoScrollToPosition])


  const isElementInView = useCallback(() => {
    const scrollElement = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]')
    const targetElement = document.getElementById('active-word')
    
    if (!scrollElement || !targetElement) return true
    
    const scrollRect = scrollElement.getBoundingClientRect()
    const elementRect = targetElement.getBoundingClientRect()
    
    return (
      elementRect.top >= scrollRect.top &&
      elementRect.bottom <= scrollRect.bottom
    )
  }, [])

  // Manejador de scroll manual
  useEffect(() => {
    const scrollElement = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]')
    
    const handleScroll = () => {
      if (!isElementInView()) {
        setShouldAutoScroll(false)
      } else {
        setShouldAutoScroll(true)
      }
    }

    scrollElement?.addEventListener('scroll', handleScroll)
    return () => scrollElement?.removeEventListener('scroll', handleScroll)
  }, [isElementInView])

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

        {!shouldAutoScroll && isPlaying && (
          <Button
            size="icon"
            variant="outline"
            className="absolute bottom-4 right-4 rounded-full shadow-lg p-2 size-fit aspect-square"
            onClick={scrollToPosition}
          >
            <ArrowDown className=" size-4" />
          </Button>
        )}
      </aside>
    </section>
  )
}