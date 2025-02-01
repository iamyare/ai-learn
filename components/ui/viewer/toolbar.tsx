import React, { useState, ReactElement } from 'react'
import { RenderGoToPageProps } from '@react-pdf-viewer/page-navigation'
import { Button } from '@/components/ui/button'
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
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  Maximize,
  ZoomInIcon,
  ZoomOutIcon,
  DownloadIcon,
  LucideIcon,
  ChevronUp,
  MoreVertical
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/components/ui/use-media-query'
import { usePDFStore } from '@/stores/usePDFStore'

interface ToolbarProps {
  toolbarSlot: ToolbarSlot
  className?: string
}

type RenderProps =
  | RenderZoomInProps
  | RenderZoomOutProps
  | RenderGoToPageProps
  | RenderEnterFullScreenProps
  | RenderDownloadProps
  | RenderPrintProps

function ToolbarButton<T extends RenderProps>({
  tooltip,
  icon: Icon,
  render,
  isDesktop
}: {
  tooltip: string
  icon: LucideIcon
  render: (renderButton: (onClick: () => void) => ReactElement<any>) => ReactElement<any>
  isDesktop: boolean
}) {
  if (isDesktop) {
    return (
      <Tooltip delayDuration={500}>
        <TooltipTrigger>
          {render((onClick) => (
            <Button variant='ghost' size='icon' onClick={onClick}>
              <Icon className='size-4' />
            </Button>
          ))}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return render((onClick) => (
    <DropdownMenuItem onClick={onClick}>
      <Icon className='mr-2 h-4 w-4' />
      <span>{tooltip}</span>
    </DropdownMenuItem>
  ))
}

export default function Toolbar({ toolbarSlot, className }: ToolbarProps) {
  const {
    CurrentPageInput,
    Download,
    EnterFullScreen,
    GoToNextPage,
    GoToPreviousPage,
    NumberOfPages,
    Print,
    ZoomIn,
    ZoomOut
  } = toolbarSlot

  const [isOpen, setIsOpen] = useState(true)
  const { currentPage, setCurrentPage } = usePDFStore()
  const isDesktop = useMediaQuery('(min-width: 600px)')

  const zoomButtons = (
    <>
      <ToolbarButton<RenderZoomOutProps>
        tooltip='Zoom Out'
        icon={ZoomOutIcon}
        render={(renderButton) => (
          <ZoomOut>
            {(props: RenderZoomOutProps) => renderButton(props.onClick)}
          </ZoomOut>
        )}
        isDesktop={isDesktop}
      />
      <ToolbarButton<RenderZoomInProps>
        tooltip='Zoom In'
        icon={ZoomInIcon}
        render={(renderButton) => (
          <ZoomIn>
            {(props: RenderZoomInProps) => renderButton(props.onClick)}
          </ZoomIn>
        )}
        isDesktop={isDesktop}
      />
    </>
  )

  const otherButtons = (
    <>
      <ToolbarButton<RenderEnterFullScreenProps>
        tooltip='Full Screen'
        icon={Maximize}
        render={(renderButton) => (
          <EnterFullScreen>
            {(props: RenderEnterFullScreenProps) => renderButton(props.onClick)}
          </EnterFullScreen>
        )}
        isDesktop={isDesktop}
      />
      <ToolbarButton<RenderDownloadProps>
        tooltip='Download'
        icon={DownloadIcon}
        render={(renderButton) => (
          <Download>
            {(props: RenderDownloadProps) => renderButton(props.onClick)}
          </Download>
        )}
        isDesktop={isDesktop}
      />
      <ToolbarButton<RenderPrintProps>
        tooltip='Print'
        icon={Printer}
        render={(renderButton) => (
          <Print>
            {(props: RenderPrintProps) => renderButton(props.onClick)}
          </Print>
        )}
        isDesktop={isDesktop}
      />
    </>
  )

  return (
    <TooltipProvider>
      <div
        className={cn(
          'flex gap-2 w-fit bg-muted/90 border backdrop-blur-sm mx-auto rounded-full items-center justify-center px-4 py-2 absolute left-1/2 -translate-x-1/2 z-10 transition-transform duration-300',
          className,
          isOpen
            ? 'bottom-2'
            : ' bottom-2 translate-y-full hover:translate-y-[90%]'
        )}
      >
        <Button
          variant={'secondary'}
          className={cn(
            'absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-2 py-1 h-fit',
            isOpen ? '' : ''
          )}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <ChevronUp
            className={cn(
              'size-4 transition-transform duration-300',
              isOpen ? 'rotate-180' : ''
            )}
          />
        </Button>

        {isDesktop && zoomButtons}

        <div className='flex items-center gap-2'>
          <GoToPreviousPage>
            {(props: RenderGoToPageProps) => (
              <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                  props.onClick()
                  setCurrentPage(currentPage - 1)
                }}
              >
                <ChevronLeft className='size-4' />
              </Button>
            )}
          </GoToPreviousPage>

          <CurrentPageInput />
          <span>/</span>
          <NumberOfPages />

          <GoToNextPage>
            {(props: RenderGoToPageProps) => (
              <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                  props.onClick()
                  setCurrentPage(currentPage + 1)
                }}
              >
                <ChevronRight className='size-4' />
              </Button>
            )}
          </GoToNextPage>
        </div>

        {isDesktop ? (
          otherButtons
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon'>
                <MoreVertical className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {zoomButtons}
              {otherButtons}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </TooltipProvider>
  )
}
