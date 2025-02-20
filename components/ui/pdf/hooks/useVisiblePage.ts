import { useEffect, RefObject } from 'react'
import { usePDFStore } from '@/stores/pdfStore'

interface UseVisiblePageProps {
  pagesRef: RefObject<(HTMLDivElement | null)[]>
  numPages: number
}

export const useVisiblePage = ({ pagesRef, numPages }: UseVisiblePageProps) => {
  const { setCurrentPage } = usePDFStore()

  useEffect(() => {
    const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]')
    if (!scrollArea) return

    const calculateVisiblePage = () => {
      const scrollTop = scrollArea.scrollTop
      const containerHeight = scrollArea.clientHeight
      const scrollAreaRect = scrollArea.getBoundingClientRect()
      
      let maxVisibility = 0
      let visiblePage = 1

      pagesRef.current?.forEach((pageDiv, index) => {
        if (!pageDiv) return

        const rect = pageDiv.getBoundingClientRect()
        const pageTop = rect.top - scrollAreaRect.top + scrollArea.scrollTop
        const pageBottom = pageTop + rect.height

        // Calcular la intersección con el viewport
        const visibleTop = Math.max(scrollTop, pageTop)
        const visibleBottom = Math.min(scrollTop + containerHeight, pageBottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)

        // Calcular el porcentaje visible de la página
        const pageVisibility = visibleHeight / rect.height

        if (pageVisibility > maxVisibility) {
          maxVisibility = pageVisibility
          visiblePage = index + 1
        }
      })

      setCurrentPage(visiblePage)
    }

    const handleScroll = () => {
      requestAnimationFrame(calculateVisiblePage)
    }

    scrollArea.addEventListener('scroll', handleScroll, { passive: true })
    // Calcular la página inicial después de que el documento se cargue
    setTimeout(calculateVisiblePage, 100)

    return () => {
      scrollArea.removeEventListener('scroll', handleScroll)
    }
  }, [numPages, setCurrentPage, pagesRef])
}