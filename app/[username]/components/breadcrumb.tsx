'use client'

import React from 'react'
import { useNavigation } from '@/hooks/useNavigation'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export default function RenderBreadcrumb() {
  const { currentPath, navigateToFolder } = useNavigation()

  const maxVisibleItems = 3

  // Asegurar que el path esté correctamente ordenado y sin duplicados
  const processedPath = currentPath.reduce((acc, current) => {
    if (!acc.some((item) => item.id === current.id)) {
      acc.push(current)
    }
    return acc
  }, [] as typeof currentPath)

  // Renombrar 'Root' a 'Dashboard' si es el primer elemento
  if (
    processedPath.length > 0 &&
    processedPath[0].name.toLowerCase() === 'root'
  ) {
    processedPath[0].name = 'Dashboard'
  }

  const visiblePath = processedPath.slice(-maxVisibleItems)
  const hiddenPath = processedPath.slice(0, -maxVisibleItems)

  if (processedPath.length === 0) {
    return null // No mostrar nada si estamos en la raíz
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {hiddenPath.length > 0 && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className='flex items-center gap-1'>
                  <BreadcrumbEllipsis className='h-4 w-4' />
                  <span className='sr-only'>Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                  {hiddenPath.map((item) => (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => navigateToFolder(item.id, item.name)}
                    >
                      {item.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {visiblePath.map((item, index) => (
          <React.Fragment key={item.id}>
            {index < visiblePath.length - 1 ? (
              <>
                <BreadcrumbItem className='cursor-pointer'>
                  <BreadcrumbLink
                    onClick={() => navigateToFolder(item.id, item.name)}
                  >
                    {item.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : (
              <BreadcrumbItem className='cursor-pointer'>
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
