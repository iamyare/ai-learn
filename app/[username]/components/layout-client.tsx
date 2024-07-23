'use client'
import { Sidebar } from '@/components/sidebar';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FolderNavigationProvider } from '@/context/useFolderNavigationContext';

export default function UsernameLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const [isCollapsed, setIsCollapsed] = useState<boolean | null>(null);

  useEffect(() => {
    const collapsedState = localStorage.getItem('react-resizable-panels:collapsed');
    setIsCollapsed(collapsedState === 'true');
  }, []);

  if (params?.notebook) {
    return <div>{children}</div>;
  }

  if (isCollapsed === null) {
    return null; // or a loading spinner
  }

  return (
    <FolderNavigationProvider>
      <Sidebar defaultCollapsed={isCollapsed}>
        {children}
      </Sidebar>
    </FolderNavigationProvider>
  );
}