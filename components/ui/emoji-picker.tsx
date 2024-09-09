'use client'
import React from 'react'
import './emoji-picker.css'

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Button } from './button'

interface EmojiPickerProps {
  children: React.ReactNode
  getValue?: (emoji: string) => void
}

import Picker from 'emoji-picker-react'

const EmojiPicker: React.FC<EmojiPickerProps> = ({ children, getValue }) => {
  const onClick = (selectedEmoji: any) => {
    if (getValue) getValue(selectedEmoji.emoji)
  }

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button variant={'ghost'} size={'icon'} className=' aspect-square p-1 text-xl h-fit'>
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent className=' p-0 w-fit border-none '>
        <Picker
          height={300}
          width={280}
          previewConfig={{ showPreview: false }}
          onEmojiClick={onClick}
          className='picker-custom' // Aplicar la clase personalizada
          style={{ background: 'var(--background)', borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}
        />
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker