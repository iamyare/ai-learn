import { getUserInfo } from '@/actions'

import PageClient from './page-client'

export default async function Home() {

  const { user, errorUser } = await getUserInfo()
  if (errorUser) {
    console.error(errorUser)
  }

  return (
    <PageClient user={user} />
  )
}
