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

const className =
  'absolute flex z-10 translate-y-1 morph-shadow shado border bg-background/70 backdrop-blur-sm rounded-md px-2 py-1 overflow-hidden max-w-[300px]'

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
      <ScrollArea className='w-full whitespace-nowrap'>
        <div className='flex space-x-2 py-1'>
          <Button
            variant={'ghost'}
            size={'sm'}
            className='bg-muted size-fit px-3 py-1 text-sm'
            onClick={addNote}
          >
            <BookmarkIcon className='size-3.5 mr-1' />
            Nota
          </Button>
          <Button
            variant={'ghost'}
            size={'sm'}
            className='bg-muted size-fit px-3 py-1 text-sm'
            onClick={chart}
          >
            <PieChartIcon className='size-3.5 mr-1' />
            Chart
          </Button>
          <Button
            variant={'ghost'}
            size={'sm'}
            className='bg-muted size-fit px-3 py-1 text-sm'
            onClick={explain}
          >
            <MessageCircleQuestionIcon className='size-3.5 mr-1' />
            Explicar
          </Button>
          <Button
            variant={'ghost'}
            size={'sm'}
            className='bg-muted size-fit px-3 py-1 text-sm'
            onClick={translate}
          >
            <Languages className='size-3.5 mr-1' />
            Traducir
          </Button>
        </div>
        <ScrollBar orientation='horizontal' className='opacity-80 pt-1' />
      </ScrollArea>
      <Button
        variant={'ghost'}
        size={'sm'}
        className='size-fit p-2 text-sm absolute top-0 right-0'
        onClick={props.cancel}
      >
        <X className='size-3.5' />
      </Button>
    </div>
  )
}

export const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
  <HighlightOptions {...props} toggle={props.toggle} />
)

export const renderHighlightContent = (props: RenderHighlightContentProps) => (
  <HighlightOptions {...props} />
)