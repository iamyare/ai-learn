'use client'
import MenuUser from '@/components/menu-user'
import CreateFolder from '@/components/modals/create-folder'
import CreateNotebook from '@/components/modals/create-notebook'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function DashboardHeader({ user }: { user: User }) {
  return (
    <header className='flex flex-col gap-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-semibold'>Dashboard</h1>
        <div className='flex gap-2 items-center'>
          <ThemeToggle />
          {/* <ConfigModal /> */}
          <MenuUser user={user} />
          {/* <LogOut/> */}
        </div>
      </div>
      <div className='flex gap-2 items-center'>
        <CreateFolder userId={user.id} />
        <CreateNotebook userId={user.id} />
      </div>
    </header>
  )
}
