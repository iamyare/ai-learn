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
import { ExportDialog } from './ExportDialog'

export function NavActions() {
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
        icon: ArrowUp,
        component: ExportDialog
      }
    ]
  ]
  return (
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
                <Button
                  variant='ghost'
                  className=' px-2 py-2 font-normal w-full h-fit justify-start'
                  key={itemIndex}
                >
                  {item.component ? (
                    <item.component />
                  ) : (
                    <>
                      <item.icon className='mr-1 h-4 w-4' />
                      <span>{item.label}</span>
                    </>
                  )}
                </Button>
              ))}
            </DropdownMenuGroup>
            {groupIndex < data.length - 1 && <Separator className=' my-2' />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
