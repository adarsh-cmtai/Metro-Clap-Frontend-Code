"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchMyBookings } from "@/app/store/features/customer/bookingsSlice";
import BookingList from "@/app/(main)/components/customer/bookings/BookingList";
import RatingModal from "@/app/(main)/components/customer/bookings/RatingModal";
import { CustomerBooking, BookingItem } from "@/types";
import { Loader2 } from "lucide-react";

type BookingTab = 'Upcoming' | 'Completed' | 'Cancelled';

interface RatingInfo {
    booking: CustomerBooking;
    item: BookingItem;
}

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingTab>('Upcoming');
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingInfo, setRatingInfo] = useState<RatingInfo | null>(null);

  const dispatch = useAppDispatch();
  const { bookings, status, error } = useAppSelector(state => state.customerBookings);
  const { token } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (token && status === 'idle') {
      dispatch(fetchMyBookings());
    }
  }, [token, status, dispatch]);

  const filteredBookings = useMemo(() => {
    if (activeTab === 'Upcoming') {
        return bookings.filter(b => ['Pending', 'Confirmed', 'Partially Assigned', 'Searching'].includes(b.status));
    }
    return bookings.filter(b => b.status === activeTab);
  }, [activeTab, bookings]);

  const handleRateClick = (booking: CustomerBooking, item: BookingItem) => {
    setRatingInfo({ booking, item });
    setIsRatingModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsRatingModalOpen(false);
    setRatingInfo(null);
  }

  const isLoading = status === 'loading' || status === 'idle';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
        <p className="text-gray-500 mt-1">View and manage all your service bookings.</p>
      </div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <button onClick={() => setActiveTab('Upcoming')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'Upcoming' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500'}`}>Upcoming</button>
          <button onClick={() => setActiveTab('Completed')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'Completed' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500'}`}>Completed</button>
          <button onClick={() => setActiveTab('Cancelled')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'Cancelled' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500'}`}>Cancelled</button>
        </nav>
      </div>

      <div>
        {isLoading ? <div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-red-500" /></div>
         : error ? <div className="text-center py-20 text-red-500">{error}</div>
         : <BookingList bookings={filteredBookings} onRate={handleRateClick} />}
      </div>

      {isRatingModalOpen && ratingInfo && ratingInfo.item.partnerId && (
        <RatingModal 
            isOpen={isRatingModalOpen} 
            onClose={handleCloseModal}
            bookingId={ratingInfo.booking._id}
            serviceId={ratingInfo.item.serviceId._id}
            serviceName={ratingInfo.item.serviceName}
            partnerId={ratingInfo.item.partnerId._id}
            partnerName={ratingInfo.item.partnerId.name}
        />
      )}
    </div>
  );
}