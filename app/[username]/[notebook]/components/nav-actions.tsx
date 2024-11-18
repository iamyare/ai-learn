'use client'

import * as React from 'react'
import {
  ArrowDown,
  ArrowUp,
  Copy,
  CornerUpRight,
  FileText,
  Link,
  MoreVertical,
  Settings2,
  Star,
  Trash2
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

const data = [
  [
    {
      label: 'Personalizar Página',
      icon: Settings2
    },
    {
      label: 'Convertir en wiki',
      icon: FileText
    }
  ],
  [
    {
      label: 'Copiar Enlace',
      icon: Link
    },
    {
      label: 'Duplicar',
      icon: Copy
    },
    {
      label: 'Mover a',
      icon: CornerUpRight
    },
    {
      label: 'Mover a la Papelera',
      icon: Trash2
    }
  ],
  [
    {
      label: 'Importar',
      icon: ArrowDown
    },
    {
      label: 'Exportar',
      icon: ArrowUp
    }
  ]
]

export function NavActions() {
  return (
    <div className='flex items-center gap-2 text-sm'>
      <div className='hidden  text-muted-foreground md:inline-block'>
        Edit Oct 08
      </div>
      <Button variant='ghost' size='icon' className='h-7 w-7'>
        <Star />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='h-7 w-7'>
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end'>
          {data.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              <DropdownMenuGroup>
                {group.map((item, itemIndex) => (
                  <DropdownMenuItem key={itemIndex}>
                    <item.icon className='mr-2 h-4 w-4' />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              {groupIndex < data.length - 1 && <Separator className=' my-2' />}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
