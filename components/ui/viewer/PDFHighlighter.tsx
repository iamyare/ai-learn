import React, { useState } from 'react'
import '@react-pdf-viewer/highlight/lib/styles/index.css'
import {
  RenderHighlightContentProps,
  RenderHighlightTargetProps
} from '@react-pdf-viewer/highlight'
import { Button } from '../button'
import { cn } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '../scroll-area'
import {
  Languages,
  MessageCircleQuestionIcon,
  PieChartIcon,
  BookmarkIcon,
  ChevronDown
} from 'lucide-react'
import {
  HighlighterAction,
  useHighlighter
} from '@/context/useHighlighterContext'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const classNameButton =
  'bg-muted size-fit px-3 py-1 text-sm transition-[transform, colors] duration-300 hover:scale-105 shadow-md hover:text-primary'

const className =
  'absolute flex z-10 translate-y-1 px-2 py-3  overflow-hidden max-w-[300px]'

type HighlightOptionsProps = RenderHighlightContentProps & {
  toggle?: () => void
}

const HighlightOptions: React.FC<HighlightOptionsProps> = (props) => {
  const { triggerAction } = useHighlighter()

  const handleAction = (action: HighlighterAction, options = {}) => {
    console.log('Triggering action', action, props.selectedText, options)
    triggerAction(action, props.selectedText, options)
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
            onClick={() => handleAction('note')}
          >
            <BookmarkIcon className='size-3.5 mr-1' />
            Nota
          </Button>
          <Button
            variant={'ghost'}
            size={'sm'}
            className={classNameButton}
            onClick={() => handleAction('explain')}
          >
            <MessageCircleQuestionIcon className='size-3.5 mr-1' />
            Explicar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'} size={'sm'} className={classNameButton}>
                <PieChartIcon className='size-3.5 mr-1' />
                Chart
                <ChevronDown className='size-3.5 ml-1' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  handleAction('chart', { chartType: 'bar' })
                }}
              >
                Barras
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleAction('chart', { chartType: 'line' })
                }}
              >
                Líneas
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleAction('chart', { chartType: 'pie' })
                }}
              >
                Circular
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleAction('chart', { chartType: 'scatter' })
                }}
              >
                Dispersión
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleAction('chart', { chartType: 'area' })
                }}
              >
                Área
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={'ghost'}
                size={'sm'}
                className={cn(classNameButton, 'flex items-center gap-1')}
              >
                <Languages className='size-3.5 mr-1' />
                Traducir
                <ChevronDown className='size-3.5 ml-1' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  handleAction('translate', { targetLanguage: 'español' })
                }}
              >
                Español
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleAction('translate', { targetLanguage: 'inglés' })
                }}
              >
                Inglés
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleAction('translate', { targetLanguage: 'francés' })
                }}
              >
                Francés
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleAction('translate', { targetLanguage: 'alemán' })
                }}
              >
                Alemán
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ScrollBar
          orientation='horizontal'
          className='opacity-80 translate-y-0.5 pt-1'
        />
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
