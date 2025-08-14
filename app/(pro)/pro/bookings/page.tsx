// --- START OF FILE app/pro/bookings/page.tsx ---

"use client"

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchProBookings } from '@/app/store/features/pro/proBookingsSlice';
import BookingTabs from '@/app/(pro)/components/pro/bookings/BookingTabs';
import { Loader2 } from 'lucide-react';

export default function MyBookingsPage() {
  const dispatch = useAppDispatch();
  const { bookings, status, error } = useAppSelector(state => state.proBookings);
  const { token } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (token && status === 'idle') {
      dispatch(fetchProBookings());
    }
  }, [token, status, dispatch]);
  
  const renderContent = () => {
    if (status === 'loading') {
      return <div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-red-500" /></div>;
    }
    if (status === 'failed') {
      return <div className="text-center py-20 text-red-500">{error || 'Could not load bookings.'}</div>;
    }
    if (status === 'succeeded' && bookings.length === 0) {
      return <div className="text-center py-20 text-gray-500">You have no bookings assigned.</div>;
    }
    return <BookingTabs bookings={bookings} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
        <p className="text-gray-500 mt-1">View your upcoming, completed, and cancelled jobs.</p>
      </div>
      {renderContent()}
    </div>
  );
}

// --- END OF FILE app/pro/bookings/page.tsx ---