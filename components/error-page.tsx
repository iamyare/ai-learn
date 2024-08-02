'use client'

export default function ErrorPage({title, message}: {title: string, message: string}) {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-5xl font-medium'>{title}</h1>
      <p className='text-muted-foreground text-lg'>{message}</p>
    </div>
  )
}
