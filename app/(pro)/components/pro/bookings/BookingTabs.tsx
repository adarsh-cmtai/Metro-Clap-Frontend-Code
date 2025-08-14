"use client";

import { useState, useMemo } from 'react';
import BookingCard from './BookingCard';
import { ProAssignedJob } from '@/types';

type BookingStatusTab = 'Upcoming' | 'Completed' | 'Cancelled';

interface BookingTabsProps {
  bookings: ProAssignedJob[];
}

export default function BookingTabs({ bookings }: BookingTabsProps) {
  const [activeTab, setActiveTab] = useState<BookingStatusTab>('Upcoming');

  const filteredBookings = useMemo(() => {
    if (activeTab === 'Upcoming') {
        const upcomingStatuses = ['PendingPartnerConfirmation', 'Assigned', 'InProgress', 'Confirmed', 'Partially Assigned'];
        return bookings.filter(b => upcomingStatuses.includes(b.status) && !b.isRejectedByMe);
    }
    const completedStatuses = ['CompletedByPartner', 'Completed'];
    if (activeTab === 'Completed') {
        return bookings.filter(b => completedStatuses.includes(b.status) && !b.isRejectedByMe);
    }
    if (activeTab === 'Cancelled') {
        return bookings.filter(b => b.bookingStatus === 'Cancelled' || b.isRejectedByMe);
    }
    return [];
  }, [activeTab, bookings]);

  const tabs: BookingStatusTab[] = ['Upcoming', 'Completed', 'Cancelled'];

  return (
    <div>
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                        ? "border-red-500 text-red-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                    {tab}
                </button>
            ))}
            </nav>
      </div>
      <div className="mt-6">
        {filteredBookings.length > 0 ? (
            <div className="space-y-4">
                {filteredBookings.map(booking => <BookingCard key={booking.itemId} booking={booking} />)}
            </div>
        ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">No bookings in this category.</p>
            </div>
        )}
      </div>
    </div>
  );
}