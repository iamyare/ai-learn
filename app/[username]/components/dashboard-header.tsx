'use client'
import ConfigModal from '@/components/modals/config'
import CreateFolder from '@/components/modals/create-folder'
import CreateNotebook from '@/components/modals/create-notebook'
import LogOut from '@/components/ui/log-out'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function DashboardHeader({ userId }: { userId: string }) {
  return (
    <header className='flex flex-col gap-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-semibold'>Dashboard</h1>
        <div className='flex gap-2 items-center'>
          <ThemeToggle />
          <ConfigModal />
          <LogOut/>
        </div>
      </div>
      <div className='flex gap-2 items-center'>
        <CreateFolder userId={userId} />
        <CreateNotebook userId={userId} />
      </div>
    </header>
  )
}
