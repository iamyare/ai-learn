import {
  countPdfDocuments,
  getApiKeys,
  getUserAndSubscriptions
} from '@/actions'
import UsernameLayoutClient from './components/layout-client'
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
  const { user } = await getUserAndSubscriptions()

  if (!user) {
    return <ErrorPage title='Error' message='No se ha encontrado el usuario' />
  }

  if (user.username !== params.username) {
    return redirect(`/${user.username}`)
  }

  const { apiKeys } = await getApiKeys({ userId: user.id })

  const { count } = await countPdfDocuments({ userId: user.id })

  const sidebarIsOpen = cookies().get('sidebar:state')
  const defaultOpen =
    sidebarIsOpen && sidebarIsOpen.value !== 'undefined'
      ? JSON.parse(sidebarIsOpen.value)
      : true

  return (
    <UsernameLayoutClient
      apiKeys={apiKeys}
      defaultOpen={defaultOpen}
      user={user}
      countPdf={count}
    >
      {children}
    </UsernameLayoutClient>
  )
}
