import React, { useState } from 'react'
import '@react-pdf-viewer/highlight/lib/styles/index.css'
import {
  RenderHighlightContentProps,
  RenderHighlightTargetProps
} from '@react-pdf-viewer/highlight'
import { Button } from '../button'
import { cn } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '../scroll-area'
import { Languages, MessageCircleQuestionIcon, PieChartIcon, X } from 'lucide-react'

const className =
  'absolute flex z-10 translate-y-1 morph-shadow shado border  bg-background/70 backdrop-blur-sm rounded-md px-2 py-1 overflow-hidden max-w-[200px]'

type MenuType = 'notes' | 'ai'

const bottoms = (toggleMenu: (menu: MenuType) => void) => {
  return (
    <div className='flex space-x-2  '>
      <Button
        variant={'ghost'}
        size={'sm'}
        className=' size-fit px-3 py-1 text-sm'
        onClick={() => toggleMenu('notes')}
      >
        Notas
      </Button>
      <Button
        variant={'ghost'}
        size={'sm'}
        className=' size-fit px-3 py-1 text-sm'
        onClick={() => toggleMenu('ai')}
      >
        IA
      </Button>
    </div>
  )
}

const toggleMenu = (
  menu: MenuType,
  activeMenu: MenuType | null,
  setActiveMenu: React.Dispatch<React.SetStateAction<MenuType | null>>,
  props: { cancel: () => void; toggle?: () => void }
) => {
  if (activeMenu === menu) {
    setActiveMenu(null)
    props.cancel()
  } else {
    setActiveMenu(menu)
    props.toggle && props.toggle()
  }
}

const HighlightTarget: React.FC<RenderHighlightTargetProps> = (props) => {
  const [activeMenu, setActiveMenu] = useState<MenuType | null>(null)

  return (
    <div
      style={{
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`
      }}
      className={className}
    >
      {bottoms((menu) => toggleMenu(menu, activeMenu, setActiveMenu, props))}
    </div>
  )
}

const HighlightContent: React.FC<RenderHighlightContentProps> = (props) => {
  const [activeMenu, setActiveMenu] = useState<MenuType | null>('notes')

  const addNote = () => {
    console.log('Añadiendo nota', props)
    props.cancel()
  }

  const chart = () => {
    console.log('Chart IA', props)
    // Aquí puedes agregar la lógica para interactuar con la IA
    props.cancel()
  }

  const explain = () => {
    console.log('Explicar IA', props)
    // Aquí puedes agregar la lógica para explicar la IA
    props.cancel()
  }

  const translate = () => {
    console.log('Traducir IA', props)
    // Aquí puedes agregar la lógica para traducir la IA
    props.cancel()
  }

  return (
    <div
      style={{
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`
      }}
      className={cn(className, '!flex-col items-center')}
    >
      {bottoms((menu) => toggleMenu(menu, activeMenu, setActiveMenu, props))}
      {activeMenu === 'notes' && (
        <div>
          <h3>Añadir Nota</h3>
          {/* Aquí puedes agregar un campo de texto para la nota */}
          <div style={{ display: 'flex', marginTop: '8px' }}>
            <Button onClick={addNote} style={{ marginRight: '8px' }}>
              Guardar Nota
            </Button>
            <Button onClick={props.cancel}>Cancelar</Button>
          </div>
        </div>
      )}
      {activeMenu === 'ai' && (
          <div className=' flex w-full justify-between items-center space-x-1'>
            <ScrollArea className='w-full whitespace-nowrap'>
              <div className='flex space-x-2'>
                <Button
                  variant={'ghost'}
                  size={'sm'}
                  className=' bg-muted size-fit px-3 py-1 text-sm'
                  onClick={chart}
                >
                  <PieChartIcon className=' size-3.5' />
                  Chart
                </Button>
                <Button
                  variant={'ghost'}
                  size={'sm'}
                  className=' bg-muted size-fit px-3 py-1 text-sm'
                  onClick={explain}
                >
                  <MessageCircleQuestionIcon className=' size-3.5' />
                  Explicar
                </Button>
                <Button
                  variant={'ghost'}
                  size={'sm'}
                  className=' bg-muted size-fit px-3 py-1 text-sm'
                  onClick={translate}
                >
                  <Languages className=' size-3.5' />
                  Traducir
                </Button>
              </div>
              <ScrollBar orientation='horizontal' className='opacity-80 pt-1' />
            </ScrollArea>
            <Button
              variant={'ghost'}
              size={'sm'}
              className=' size-fit p-2 text-sm'
              onClick={props.cancel}
            >
              <X className=' size-3.5' />
            </Button>
          </div>
      )}
    </div>
  )
}

export const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
  <HighlightTarget {...props} />
)

export const renderHighlightContent = (props: RenderHighlightContentProps) => (
  <HighlightContent {...props} />
)
