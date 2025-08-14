"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from '@/components/admin/AdminHeader';
import { useAppSelector } from '@/app/store/hooks';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, token, status } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (status === 'succeeded' && (!user || user.role !== 'admin')) {
      router.push('/');
    }
    if (status === 'failed' || (status !== 'loading' && !token)) {
      router.push('/');
    }
  }, [user, status, token, router]);

  if (status === 'loading' || !user || user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans text-slate-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col w-full lg:ml-64">
        <AdminHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}