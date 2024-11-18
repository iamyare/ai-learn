'use client'

import MenuUser from '@/components/menu-user'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ChevronLeft, Star } from 'lucide-react'
import { NavActions } from './nav-actions'
import { useRouter } from 'next/navigation'
import { format } from '@formkit/tempo'

export default function HeaderNotebook({
  notebookInfo,
  user
}: {
  notebookInfo: NotebookInfo
  user: User
}) {
  const router = useRouter()

  return (
    <header className='w-screen flex justify-between items-center h-10 py-1 px-2 border-b'>
      <div className='flex items-center gap-2'>
        <Button
          size='icon'
          variant='ghost'
          className='p-1 size-8'
          onClick={() => router.back()}
        >
          <ChevronLeft className='size-4' />
        </Button>
        <h2
          className='font-medium'
          style={{
            viewTransitionName: `notebook-${notebookInfo.notebook_id}`
          }}
        >
          {notebookInfo.notebook_name}
        </h2>
      </div>
      <div className='flex items-center gap-1'>
        <p className='hidden text-xs  text-muted-foreground md:inline-block'>
          Editado {format(notebookInfo.updated_at, 'medium')}
        </p>
        <Button variant='ghost' size='icon' className=' size-fit p-2'>
          <Star />
        </Button>
        <ThemeToggle className=' size-fit p-4' />
        {user && <MenuUser user={user} />}
        <NavActions />
      </div>
    </header>
  )
}
