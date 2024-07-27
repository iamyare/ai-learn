
'use client'
import CreateFolder from '@/components/modals/create-folder'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { FilePlus2 } from 'lucide-react'

export default function DashboardHeader() {
  return (
    <header className='flex flex-col gap-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-semibold'>Dashboard</h1>
        <div className='flex gap-2 items-center'>
          <ThemeToggle />
          

        </div>
      </div>
      <div className='flex gap-2 items-center'>
        <CreateFolder userId='346a2de6-85e2-4429-b4a4-e9fefd28a89c' />
        <Button variant={'outline'}>
          <FilePlus2 className='size-4 mr-2' />
          <span>Notebook</span>
        </Button>
      </div>
    </header>
  )
}