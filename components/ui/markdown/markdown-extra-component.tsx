import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { File } from 'lucide-react'
import { ReactNode } from 'react'
import { usePDFStore } from '@/stores/pdfStore'
import { useHighlighterStore } from '@/stores/useHighlighterStore'

interface PageProps {
  children: ReactNode
}

export const PageComponent = ({ children }: PageProps) => {
  const { setCurrentPage } = usePDFStore()
  const { triggerAction } = useHighlighterStore()

  const handleClick = () => {
    // Convertir el texto de la página a número
    const pageNumber = Number(children)
    if (!isNaN(pageNumber)) {
      // Navegar a la página
      setCurrentPage(pageNumber)
      
      // Activar el modo de resaltado con una nota
      triggerAction('note', `Referencia de la página ${pageNumber}`)
    }
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <sup 
            className='bg-background rounded-sm px-1.5 py-0.5 border cursor-pointer hover:bg-muted transition-colors'
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleClick()
              }
            }}
          >
            {children}
          </sup>
        </TooltipTrigger>
        <TooltipContent className='flex items-center'>
          <File className='size-3 mr-1'/>
          Click para ir a la página {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
