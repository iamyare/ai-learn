'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { Button } from "./ui/button"
import Link from "next/link"
import ConfigModal from "./modals/config"
import LogOut from "./ui/log-out"
import { UserIcon } from "lucide-react"

export default function MenuUser({ user }: { user: User }) {
  return (
    <Menu as='div' className='relative'>
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
          <Link href={user.username}>
          <UserIcon className='size-4 mr-2'  />
          Mi perfil</Link>
        </Button>
      </MenuItem>
      <MenuItem>
        <ConfigModal />
      </MenuItem>
      <MenuItem>
    <LogOut />
      </MenuItem>
    </MenuItems>
  </Menu>
  )
}
