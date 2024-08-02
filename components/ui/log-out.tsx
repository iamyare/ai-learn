'use client'


import { logout } from '@/actions'
import { Button } from '@/components/ui/button'
import { LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'


export default function LogOut() {
    const router = useRouter()


  return (
    <Button
    variant={'ghost'}
    className=' w-full font-normal text-foreground justify-start rounded-none'
    onClick={async()=>{
      logout()
      router.push('/')
    }}
  >
      <LogOutIcon className='size-4 mr-2'  />
      Cerrar sesión
    </Button>
  )
}
