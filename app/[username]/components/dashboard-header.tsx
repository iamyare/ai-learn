
'use client'
import ConfigModal from '@/components/modals/config'
import CreateFolder from '@/components/modals/create-folder'
import CreateNotebook from '@/components/modals/create-notebook'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { FilePlus2 } from 'lucide-react'

export default function DashboardHeader({ userId }: { userId: string }) {
  return (
    <header className='flex flex-col gap-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-semibold'>Dashboard</h1>
        <div className='flex gap-2 items-center'>
          <ThemeToggle />
          <ConfigModal />
          

        </div>
      </div>
      <div className='flex gap-2 items-center'>
        <CreateFolder userId={userId} />
        <CreateNotebook userId={userId} />
      </div>
    </header>
  )
}