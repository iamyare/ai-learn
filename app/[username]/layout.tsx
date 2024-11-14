import { getApiKeys, getUserInfo } from '@/actions'
import { UserProvider } from '@/context/useUserContext'
import UsernameLayoutClient from './components/layout-client'
import { ApiKeysProvider } from '@/context/useAPIKeysContext'
import { cookies } from 'next/headers'
import ErrorPage from '@/components/error-page'
import { redirect } from 'next/navigation'

export default async function UsernameLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { username: string }
}) {
  const { user } = await getUserInfo()

  if (!user) {
    // Redirect to login page
    return <ErrorPage title='Error' message='No se ha encontrado el usuario' />
  }

  if (user.username !== params.username) {
    // Redirect to correct username page
    return redirect(`/${user.username}`)
  }

  const { apiKeys } = await getApiKeys({ userId: user.id })

  const sidebarIsOpen = cookies().get('sidebar:state')
  const defaultOpen =
    sidebarIsOpen && sidebarIsOpen.value !== 'undefined'
      ? JSON.parse(sidebarIsOpen.value)
      : true

  return (
    <UserProvider user={user}>
      <ApiKeysProvider
        initialApiKeys={apiKeys ?? undefined}
        initialUserId={user.id}
      >
        <UsernameLayoutClient defaultOpen={defaultOpen} userId={user.id}>
          {children}
        </UsernameLayoutClient>
      </ApiKeysProvider>
    </UserProvider>
  )
}
