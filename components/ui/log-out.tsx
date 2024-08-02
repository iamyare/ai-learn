'use client'


import { logout } from '@/actions'
import { Button } from '@/components/ui/button'
import { LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'


export default function LogOut() {
    const router = useRouter()


  return (
    <Button variant='ghost' size='icon'>
      <LogOutIcon className='size-4' onClick={async()=>{
        logout()
        router.push('/')
      }} />
    </Button>
  )
}
