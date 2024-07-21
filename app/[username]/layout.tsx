'use client'
import { Sidebar } from '@/components/sidebar';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UsernameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    const collapsedState = localStorage.getItem('react-resizable-panels:collapsed') === 'true';
    setIsCollapsed(collapsedState);
  }, []);

  if (params?.notebook) {
    return (
      <div>
        {children}
      </div>
    );
  }

  return (
    <Sidebar defaultCollapsed={isCollapsed}>
      {children}
    </Sidebar>
  );
}