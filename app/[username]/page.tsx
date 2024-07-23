import { FolderNavigationProvider } from '@/context/useFolderNavigationContext'
import { getUserInfo } from '@/actions'
import DashboardClient from './components/dahsboard'

export default async function Dashboard({
  params
}: {
  params: { username: string }
}) {
  const { user } = await getUserInfo()



  if (!user) {
    // Redirect to login page
    return <div>Please log in</div>
  }

  if (user.username !== params.username) {
    // Redirect to correct username page
    // You might want to use redirect() from 'next/navigation' here
    return <div>Redirecting...</div>
  }

  return (
    <FolderNavigationProvider>
      <DashboardClient user={user} />
    </FolderNavigationProvider>
  )
}
