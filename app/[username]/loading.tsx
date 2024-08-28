import LoadingComponent from '@/components/ui/loading-component'
import React from 'react'

export default function loading() {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <LoadingComponent />
    </div>
  )
}
