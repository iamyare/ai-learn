import React from 'react'
import '@react-pdf-viewer/highlight/lib/styles/index.css'
import {
  RenderHighlightContentProps,
  RenderHighlightTargetProps
} from '@react-pdf-viewer/highlight'
import { Button } from '../button'
import { cn } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '../scroll-area'
import { Languages, MessageCircleQuestionIcon, PieChartIcon, X, BookmarkIcon } from 'lucide-react'

const classNameButton = 'bg-muted size-fit px-3 py-1 text-sm transition-[transform, colors] duration-300 hover:scale-105 shadow-md hover:text-primary'

const className =
        'absolute flex z-10 translate-y-1 px-2 py-3  overflow-hidden max-w-[300px]'

type HighlightOptionsProps = RenderHighlightContentProps & {
  toggle?: () => void;
}

const HighlightOptions: React.FC<HighlightOptionsProps> = (props) => {
  const addNote = () => {
    console.log('Añadiendo nota', props)
    props.cancel()
  }

  const chart = () => {
    console.log('Chart IA', props)
    props.cancel()
  }

  const explain = () => {
    console.log('Explicar IA', props)
    props.cancel()
  }

  const translate = () => {
    console.log('Traducir IA', props)
    props.cancel()
  }

  return (
    <div
      style={{
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`
      }}
      className={cn(className, 'flex-col items-center')}
    >
      <ScrollArea className='w-full m-1 h-full whitespace-nowrap'>
        <div className='flex space-x-2 py-1'>
          <Button
            variant={'ghost'}
            size={'sm'}
            className={classNameButton}
            onClick={addNote}
          >
            <BookmarkIcon className='size-3.5 mr-1' />
            Nota
          </Button>
          <Button
            variant={'ghost'}
            size={'sm'}
            className={classNameButton}
            onClick={explain}
          >
            <MessageCircleQuestionIcon className='size-3.5 mr-1' />
            Explicar
          </Button>
          <Button
            variant={'ghost'}
            size={'sm'}
            className={classNameButton}
            onClick={chart}
          >
            <PieChartIcon className='size-3.5 mr-1' />
            Chart
          </Button>
          <Button
            variant={'ghost'}
            size={'sm'}
            className={classNameButton}
            onClick={translate}
          >
            <Languages className='size-3.5 mr-1' />
            Traducir
          </Button>
        </div>
        <ScrollBar orientation='horizontal' className='opacity-80 translate-y-0.5 pt-1' />
      </ScrollArea>
    </div>
  )
}

export const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
  <HighlightOptions {...props} toggle={props.toggle} />
)

export const renderHighlightContent = (props: RenderHighlightContentProps) => (
  <HighlightOptions {...props} />
)