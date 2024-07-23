
import { getUserInfo } from '@/actions';
import { UserProvider } from '@/context/useUserContext';
import UsernameLayoutClient from './components/layout-client';

export default async function UsernameLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const { user } = await getUserInfo();

  if (!user) {
    // Redirect to login page
    return <div>Please log in</div>;
  }

  if (user.username !== params.username) {
    // Redirect to correct username page
    // You might want to use redirect() from 'next/navigation' here
    return <div>Redirecting...</div>;
  }

  return (
    <UserProvider user={user}>
      <UsernameLayoutClient>{children}</UsernameLayoutClient>
    </UserProvider>
  );
}