'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from './button';

interface EmojiPickerProps {
  children: React.ReactNode;
  getValue?: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ children, getValue }) => {
  const Picker = dynamic(() => import('emoji-picker-react'));
  const onClick = (selectedEmoji: any) => {
    if (getValue) getValue(selectedEmoji.emoji);
  };
  return (
      <Popover>
        <PopoverTrigger asChild>
            <Button variant={'ghost'} size={'icon'} className=' aspect-square' >{children}</Button>
        </PopoverTrigger>
        <PopoverContent
          className=" p-0 w-fit border-none "
        >
          <Picker height={350} width={250} onEmojiClick={onClick} />
        </PopoverContent>
      </Popover>
  );
};

export default EmojiPicker;