import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { File } from 'lucide-react'
import { ReactNode } from 'react'

export const PageComponent = ({ children }: { children: ReactNode }) => {


  return(
    <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <sup className='bg-background rounded-sm px-1.5 py-0.5 border'>
          {children}
        </sup>
      </TooltipTrigger>
      <TooltipContent className='flex items-center'>
      <File className=' size-3 mr-1'/>
        Referencia en la página {children}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
  )
}

