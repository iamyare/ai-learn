import { Suspense } from 'react'
import DashboardHeader from './components/dashboard-header'
import FolderList from './components/folder-list'
import { ErrorBoundary } from 'react-error-boundary'
import { getFolders } from '@/actions'

export default async function Dashboard({
  params
}: {
  params: { username: string }
}) {
  const { folders, errorFolders } = await getFolders({
    userId: '346a2de6-85e2-4429-b4a4-e9fefd28a89c'
  })

  if (errorFolders){
    return <div>hola</div>
  }

  if(!folders){
    return <div>no hay folder</div>
  }

  return (
    <main className='flex flex-col gap-8'>
      <DashboardHeader />
      <FolderList folders={folders}/>
    </main>
  )
}
