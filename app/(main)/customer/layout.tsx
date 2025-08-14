"use client";

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/(main)/components/customer/Sidebar';
import CustomerHeader from '@/app/(main)/components/customer/CustomerHeader';
import { Loader2 } from 'lucide-react';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, token, status } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (status !== 'idle' && status !== 'loading') {
      if (!token || !user || user.role !== 'customer') {
        router.replace('/');
      }
    }
  }, [status, token, user, router]);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-red-500" />
      </div>
    );
  }

  if (user && user.role === 'customer') {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="lg:ml-64">
          <CustomerHeader onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Loader2 className="w-12 h-12 animate-spin text-red-500" />
    </div>
  );
}