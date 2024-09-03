import { useState } from 'react'
import { Menu } from '@headlessui/react'
import { Button } from './ui/button'
import Link from 'next/link'
import ConfigModal from './modals/config'
import LogOut from './ui/log-out'
import { UserIcon, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function MenuUser({ user }: { user: User }) {
  const pathname = usePathname()
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  return (
    <Menu as='div' className='relative'>
      {({ open }) => (
        <>
          <Menu.Button className='relative flex rounded-full bg-muted text-sm focus:outline-none focus:ring-2  focus:ring-ring focus:ring-offset-2'>
            <span className='absolute -inset-1.5' />
            <span className='sr-only'>Open user menu</span>
            <div className='flex items-center justify-center size-8 rounded-full bg-muted'>
              {user.username[0]}
            </div>
          </Menu.Button>

          <Menu.Items
            className='absolute overflow-hidden right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-background shadow-lg ring-1  ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'
          >
            <Menu.Item>
              {({ active }) => (
                <Button
                  variant={'ghost'}
                  className={`w-full font-normal text-foreground justify-start rounded-none ${
                    active ? 'bg-accent' : ''
                  }`}
                  asChild
                >
                  <Link href={`/${user.username}`}>
                    <UserIcon className='size-4 mr-2' />
                    Mi perfil
                  </Link>
                </Button>
              )}
            </Menu.Item>
            {pathname !== '/' && (
              <Menu.Item>
                {({ active }) => (
                  <Button
                    variant={'ghost'}
                    className={`w-full font-normal text-foreground justify-start rounded-none ${
                      active ? 'bg-accent' : ''
                    }`}
                    onClick={() => setIsConfigOpen(true)}
                  >
                    <Settings className='size-4 mr-2' />
                    Configuración
                  </Button>
                )}
              </Menu.Item>
            )}
            <Menu.Item>
              {({ active }) => (
                <LogOut />
              )}
            </Menu.Item>
          </Menu.Items>

          {isConfigOpen && (
            <ConfigModal open={isConfigOpen} onOpenChange={setIsConfigOpen} />
          )}
        </>
      )}
    </Menu>
  )
}