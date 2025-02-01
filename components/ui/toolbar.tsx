'use client'
import { useEffect, useState } from 'react'
import { Button } from './button'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp,
  Maximize,
  MoreVertical, 
  ZoomIn,
  ZoomOut
} from 'lucide-react'
import { usePDFStore } from '@/stores/pdfStore'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useMediaQuery } from './use-media-query'
import { Input } from './input'

interface ToolbarProps {
  pagesRef: React.RefObject<(HTMLDivElement | null)[]>
  containerRef: React.RefObject<HTMLDivElement> // Tipo más específico
  className?: string
}

export function Toolbar({ pagesRef, containerRef, className }: ToolbarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const { scale, currentPage, numPages, setScale, setCurrentPage } = usePDFStore()
  const isDesktop = useMediaQuery('(min-width: 600px)')
  const [pageInput, setPageInput] = useState<string>('')
  const [isFullScreen, setIsFullScreen] = useState(false)

  const handleZoom = (newScale: number) => {
    setScale(Math.min(Math.max(0.5, newScale), 2.0))
  }

  const scrollToPage = (pageNum: number) => {
    pagesRef.current?.[pageNum - 1]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const toggleFullScreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullScreen(true);
      } catch (err) {
        console.error('Error al entrar en pantalla completa:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullScreen(false);
      } catch (err) {
        console.error('Error al salir de pantalla completa:', err);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=') {
          e.preventDefault()
          handleZoom(scale + 0.1)
        } else if (e.key === '-') {
          e.preventDefault()
          handleZoom(scale - 0.1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [scale])

  useEffect(() => {
    setPageInput(currentPage.toString())
  }, [currentPage])

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullScreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange)
  }, [])

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d+$/.test(value)) {
      setPageInput(value)
    }
  }

  const handlePageInputConfirm = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newPage = Math.min(Math.max(1, parseInt(pageInput) || 1), numPages)
      setCurrentPage(newPage)
      scrollToPage(newPage)
      setPageInput(newPage.toString())
    }
  }

  const zoomButtons = (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => handleZoom(scale - 0.1)}
            variant="ghost"
            size="icon"
            aria-label="Reducir zoom"
          >
            <ZoomOut className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reducir zoom</p>
        </TooltipContent>
      </Tooltip>
      <span className=" text-center font-medium">
        {Math.round(scale * 100)}%
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => handleZoom(scale + 0.1)}
            variant="ghost"
            size="icon"
            aria-label="Aumentar zoom"
          >
            <ZoomIn className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Aumentar zoom</p>
        </TooltipContent>
      </Tooltip>
    </>
  )

  const navigationButtons = (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              const newPage = Math.max(currentPage - 1, 1)
              setCurrentPage(newPage)
              scrollToPage(newPage)
            }}
            disabled={currentPage <= 1}
            variant="ghost"
            size="icon"
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Página anterior</p>
        </TooltipContent>
      </Tooltip>
      
      <div className="flex items-center gap-1">
        <Input
          type="text"
          value={pageInput}
          onChange={handlePageInputChange}
          onKeyDown={handlePageInputConfirm}
          className=" text-center w-12"
          onBlur={() => setPageInput(currentPage.toString())}
          aria-label="Número de página"
        />
        <span className="text-sm">/</span>
        <span className="text-sm">{numPages}</span>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              const newPage = Math.min(currentPage + 1, numPages)
              setCurrentPage(newPage)
              scrollToPage(newPage)
            }}
            disabled={currentPage >= numPages}
            variant="ghost"
            size="icon"
            aria-label="Página siguiente"
          >
            <ChevronRight className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Página siguiente</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )

  return (
    <TooltipProvider>
      <div
        className={cn(
          'flex gap-2 w-fit bg-muted/90 border backdrop-blur-sm mx-auto rounded-full items-center justify-center px-4 py-2 absolute left-1/2 -translate-x-1/2 z-10 transition-transform duration-300',
          className,
          isOpen ? 'bottom-2' : 'bottom-2 translate-y-full hover:translate-y-[90%]'
        )}
      >
        <Button
          variant="secondary"
          className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-2 py-1 h-fit"
          onClick={() => setIsOpen(prev => !prev)}
          aria-label="Mostrar/ocultar barra de herramientas"
        >
          <ChevronUp
            className={cn(
              'size-4 transition-transform duration-300',
              isOpen ? 'rotate-180' : ''
            )}
          />
        </Button>

        {isDesktop && zoomButtons}
        {navigationButtons}

        {isDesktop ? (
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleFullScreen}
                  aria-label={isFullScreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                >
                  <Maximize className={cn(
                    "size-4 transition-transform",
                    isFullScreen ? "rotate-180" : ""
                  )} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFullScreen ? 'Salir de pantalla completa' : 'Pantalla completa'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Más opciones">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={toggleFullScreen}>
                <Maximize className="mr-2 size-4" />
                <span>{isFullScreen ? 'Salir de pantalla completa' : 'Pantalla completa'}</span>
              </DropdownMenuItem>
              {/* Add more mobile menu items here */}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </TooltipProvider>
  )
}
