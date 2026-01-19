'use client';

import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/AppSidebar';
import { Header } from '@/components/sidebar/Header';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { FaHome, FaUsers, FaListUl } from 'react-icons/fa';
import type { IsidebarItems } from '@/types';

const sidebarData: IsidebarItems[] = [
  { title: "Dashboard", url: "/dashboard", icon: FaHome },
  { title: "Leads", url: "/leads", icon: FaListUl },
  { title: "Students", url: "/students", icon: FaUsers },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" sidebarData={sidebarData} />
      <SidebarInset className="p-4">
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}