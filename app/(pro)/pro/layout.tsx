"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProSidebar from '@/app/(pro)/components/pro/ProSidebar';
import ProHeader from '@/app/(pro)/components/pro/ProHeader';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchCurrentUser } from '@/app/store/features/auth/authSlice';
import { Loader2 } from 'lucide-react';

export default function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, token, status } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (token && status !== 'loading') {
      if (!user || user.role !== 'partner') {
        router.push('/');
      } else if (!user.partnerProfile) {
        dispatch(fetchCurrentUser());
      }
    } else if (status !== 'loading' && !token) {
      router.push('/');
    }
  }, [dispatch, token, user, status, router]);

  if (status === 'loading' || !user || user.role !== 'partner') {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader2 className="w-10 h-10 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <ProSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="lg:ml-64">
        <ProHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}