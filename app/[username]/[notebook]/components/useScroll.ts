import { useCallback, useEffect, useRef, useState } from 'react'

export function useScroll(isListening: boolean, transcript: string, isPlaying: boolean, currentPosition: number) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  const scrollToPosition = useCallback(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
      const targetElement = document.getElementById(`active-word`)

      if (scrollElement && targetElement) {
        const scrollRect = scrollElement.getBoundingClientRect()
        const elementRect = targetElement.getBoundingClientRect()
        const elementTop = elementRect.top - scrollRect.top

        const targetScroll =
          scrollElement.scrollTop +
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
      const scrollElement = scrollRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
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
  }, [
    isListening,
    isPlaying,
    transcript,
    currentPosition,
    scrollToBottom,
    autoScrollToPosition
  ])

  const isElementInView = useCallback(() => {
    const scrollElement = scrollRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    )
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
    const scrollElement = scrollRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    )

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

  return {
    scrollRef,
    shouldAutoScroll,
    scrollToPosition,
    setShouldAutoScroll
  }
}