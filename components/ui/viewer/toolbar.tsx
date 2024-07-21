'use client'

import React, { useState, useCallback, memo, ReactElement, useRef, useEffect } from 'react'
import { ToolbarSlot } from '@react-pdf-viewer/toolbar'
import { RenderZoomInProps, RenderZoomOutProps } from '@react-pdf-viewer/zoom'
import { RenderGoToPageProps } from '@react-pdf-viewer/page-navigation'
import { RenderEnterFullScreenProps } from '@react-pdf-viewer/full-screen'
import { RenderDownloadProps } from '@react-pdf-viewer/get-file'
import { RenderPrintProps } from '@react-pdf-viewer/print'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  Maximize,
  ZoomInIcon,
  ZoomOutIcon,
  DownloadIcon,
  LucideIcon,
  ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCurrentPage } from '@/context/useCurrentPageContext'

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
  render
}: {
  tooltip: string
  icon: LucideIcon
  render: (renderButton: (onClick: () => void) => ReactElement) => ReactElement
}) {
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

interface CurrentPageLabelProps {
  children: (props: {
    currentPage: number
    numberOfPages: number
  }) => ReactElement
}

const CurrentPageWrapper: React.FC<{
  CurrentPageLabel: React.ComponentType<CurrentPageLabelProps>;
}> = ({ CurrentPageLabel }) => {
  const { setCurrentPage } = useCurrentPage();
  const [currentPage, setCurrentPageLocal] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    // Asumiendo que quieres incrementar currentPage por 1 antes de establecerlo
    setCurrentPage(currentPage + 1);
  }, [currentPage, setCurrentPage]);

  return (
    <CurrentPageLabel>
      {(props: { currentPage: number; numberOfPages: number }) => {
        // Actualiza el estado local que a su vez, disparará el useEffect
        if (currentPage !== props.currentPage) {
          setCurrentPageLocal(props.currentPage);
        }
        if (numberOfPages !== props.numberOfPages) {
          setNumberOfPages(props.numberOfPages);
        }

        return (
          <>
            {/* Tu lógica de visualización de página aquí */}
            <span>{props.currentPage + 1}</span>
          </>
        );
      }}
    </CurrentPageLabel>
  );
};

const MemoizedCurrentPageWrapper = React.memo(CurrentPageWrapper);

export default function Toolbar({ toolbarSlot, className }: ToolbarProps) {
  const {
    CurrentPageInput,
    CurrentPageLabel,
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
  const { currentPage, setCurrentPage } = useCurrentPage()
  const prevPageRef = useRef<number | null>(null)

  const updateCurrentPage = useCallback(
    (newPage: number) => {
      if (prevPageRef.current !== newPage) {
        setCurrentPage(newPage + 1)
        prevPageRef.current = newPage
      }
    },
    [setCurrentPage]
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
            ' absolute top-0 -translate-y-1/2  left-1/2 -translate-x-1/2 px-2 py-1 h-fit ',
            isOpen ? '' : ''
          )}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <ChevronUp
            className={cn(
              'size-4  transition-transform duration-300',
              isOpen ? 'rotate-180' : ''
            )}
          />
        </Button>

        <ToolbarButton<RenderZoomOutProps>
          tooltip='Zoom Out'
          icon={ZoomOutIcon}
          render={(renderButton) => (
            <ZoomOut>
              {(props: RenderZoomOutProps) => renderButton(props.onClick)}
            </ZoomOut>
          )}
        />

        <ToolbarButton<RenderZoomInProps>
          tooltip='Zoom In'
          icon={ZoomInIcon}
          render={(renderButton) => (
            <ZoomIn>
              {(props: RenderZoomInProps) => renderButton(props.onClick)}
            </ZoomIn>
          )}
        />

        <div className='px-1 flex items-center gap-2'>
          <ToolbarButton<RenderGoToPageProps>
            tooltip='Previous Page'
            icon={ChevronLeft}
            render={(renderButton) => (
              <GoToPreviousPage>
                {(props: RenderGoToPageProps) =>
                  renderButton(() => {
                    props.onClick()
                    setCurrentPage(currentPage - 1)
                  })
                }
              </GoToPreviousPage>
            )}
          />

          <MemoizedCurrentPageWrapper CurrentPageLabel={CurrentPageLabel} />

          <CurrentPageInput />
          <span>/</span>
          <NumberOfPages />

          <ToolbarButton<RenderGoToPageProps>
            tooltip='Next Page'
            icon={ChevronRight}
            render={(renderButton) => (
              <GoToNextPage>
                {(props: RenderGoToPageProps) =>
                  renderButton(() => {
                    props.onClick()
                    setCurrentPage(currentPage + 1)
                  })
                }
              </GoToNextPage>
            )}
          />
        </div>

        <ToolbarButton<RenderEnterFullScreenProps>
          tooltip='Full Screen'
          icon={Maximize}
          render={(renderButton) => (
            <EnterFullScreen>
              {(props: RenderEnterFullScreenProps) =>
                renderButton(props.onClick)
              }
            </EnterFullScreen>
          )}
        />

        <ToolbarButton<RenderDownloadProps>
          tooltip='Download'
          icon={DownloadIcon}
          render={(renderButton) => (
            <Download>
              {(props: RenderDownloadProps) => renderButton(props.onClick)}
            </Download>
          )}
        />

        <ToolbarButton<RenderPrintProps>
          tooltip='Print'
          icon={Printer}
          render={(renderButton) => (
            <Print>
              {(props: RenderPrintProps) => renderButton(props.onClick)}
            </Print>
          )}
        />
      </div>
    </TooltipProvider>
  )
}
