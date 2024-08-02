import { cn } from '@/lib/utils'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/react'
import { MenuIcon, XIcon } from 'lucide-react'
import { ThemeToggle } from './ui/theme-toggle'
import Link from 'next/link'
import { Button } from './ui/button'

const navigation = [
  { name: 'Inicio', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false }
]

export default function NabarClient({ user }: { user: User | null }) {
  return (
    <Disclosure
      as='nav'
      className=' fixed top-0 left-0 right-0 backdrop-blur-md z-50'
    >
      <div className='mx-auto px-4 md:px-44'>
        <div className='relative flex h-16 items-center justify-between'>
          <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
            {/* Mobile menu button*/}
            <DisclosureButton className='group relative inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring'>
              <span className='absolute -inset-0.5' />
              <span className='sr-only'>Open main menu</span>
              <MenuIcon
                aria-hidden='true'
                className='block size-5 group-data-[open]:hidden'
              />
              <XIcon
                aria-hidden='true'
                className='hidden size-5 group-data-[open]:block'
              />
            </DisclosureButton>
          </div>
          <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
            <div className='flex flex-shrink-0 items-center'>
              <span className=' text-2xl text-primary font-medium'>
                Stick Note
              </span>
            </div>
            <div className='hidden sm:ml-6 sm:block'>
              <div className='flex space-x-4'>
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={cn(
                      item.current
                        ? 'bg-primary text-white'
                        : 'text-muted-foreground hover:bg-muted ',
                      'rounded-md px-3 py-2 text-sm font-medium'
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
            <ThemeToggle />

            {/* Profile dropdown */}
            {user ? (
              <Menu as='div' className='relative ml-3'>
                <div>
                  <MenuButton className='relative flex rounded-full bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'>
                    <span className='absolute -inset-1.5' />
                    <span className='sr-only'>Open user menu</span>
                    <div className='flex items-center justify-center size-8 rounded-full'>
                      {user.username[0]}
                    </div>
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className='absolute overflow-hidden right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-background  shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'
                >
                  <MenuItem>
                    <Button
                      variant={'ghost'}
                      className=' w-full font-normal text-foreground justify-start rounded-none'
                      asChild
                    >
                      <Link href={user.username}>Mi perfil</Link>
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      href='#'
                      className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100'
                    >
                      Ajustes
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      href='#'
                      className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100'
                    >
                      Cerrar sesión
                    </Link>
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <Button
                className='w-fit px-6 py-2 text-lg'
                aria-label='Descubre más sobre nuestras funcionalidades'
              >
                Inicia sesión
              </Button>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className='sm:hidden'>
        <div className='space-y-1 px-2 pb-3 pt-2'>
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as='a'
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={cn(
                item.current
                  ? 'bg-primary text-white'
                  : ' text-muted-foreground hover:bg-muted/50 ',
                'block rounded-md px-3 py-2 text-base font-medium'
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
