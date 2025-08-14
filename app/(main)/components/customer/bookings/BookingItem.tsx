"use client";

import { useState } from 'react';
import { useAppDispatch } from '@/app/store/hooks';
import { cancelBooking, rescheduleBooking, payRemaining } from '@/app/store/features/customer/bookingsSlice';
import { ChevronDown, Star, Download, Clock, Phone, XCircle, CreditCard, Wallet } from 'lucide-react';
import { CustomerBooking, BookingItem as BookingItemType } from '@/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface BookingItemProps {
  booking: CustomerBooking;
  onRate: (booking: CustomerBooking, item: BookingItemType) => void;
}

export default function BookingItem({ booking, onRate }: BookingItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useAppDispatch();
  const mainService = booking.items.length > 0 ? booking.items[0] : null;

  const handleDownloadInvoice = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        toast.error("You must be logged in to download an invoice.");
        return;
    }
    
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${backendUrl}/api/customer/bookings/${booking._id}/invoice`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Invoice download failed.');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${booking._id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Invoice downloading...");

    } catch (error) {
        toast.error("Could not download invoice. Please try again later.");
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
        dispatch(cancelBooking(booking._id));
    }
  };
  
  const handlePayRemaining = () => {
    dispatch(payRemaining({ bookingId: booking._id, booking }));
  };

  const handleReschedule = () => {
    const newDate = prompt("Enter new date (YYYY-MM-DD):");
    const newSlot = prompt("Enter new time slot (e.g., 10:00 AM - 11:00 AM):");
    if (newDate && newSlot) {
        dispatch(rescheduleBooking({ bookingId: booking._id, bookingDate: newDate, slotTime: newSlot }));
    } else {
        toast.error("Both date and time slot are required to reschedule.");
    }
  };

  const getBookingTitle = () => {
    if (!mainService) return "Booking Details";
    if (booking.items.length > 1) {
        return `${mainService.serviceName} + ${booking.items.length - 1} more`;
    }
    return mainService.serviceName;
  };

  const assignedPartner = booking.items.find(item => item.partnerId)?.partnerId;
  const showPayLater = booking.status === 'Completed' && booking.amountDue > 0;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-lg text-gray-800">{getBookingTitle()}</p>
          <p className="text-sm text-gray-500">{format(new Date(booking.bookingDate), 'PPP \'at\' hh:mm a')}</p>
        </div>
        <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center text-sm font-semibold text-red-600">
          Details
          <ChevronDown className={`w-5 h-5 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t space-y-6">
            <div>
                <h4 className="font-semibold text-gray-800 mb-2">Service Details</h4>
                <div className='space-y-4 divide-y divide-gray-100'>
                    {booking.items.map(item => (
                        <div key={item._id} className="pt-4 first:pt-0">
                            <p className='font-semibold text-gray-700'>{item.serviceName}</p>
                             {booking.bookingOTP && (
                                <p className="text-sm font-medium text-gray-600">Booking OTP: <span className="font-bold text-red-600">{booking.bookingOTP}</span></p>
                            )}
                            {item.partnerId ? (
                                <div className="flex items-center space-x-3 mt-2">
                                    <img src={item.partnerId.avatarUrl || `https://i.pravatar.cc/150?u=${item.partnerId._id}`} alt={item.partnerId.name} className="w-10 h-10 rounded-full"/>
                                    <div>
                                        <p className="text-sm text-gray-800">{item.partnerId.name}</p>
                                        <div className="text-xs text-gray-500 flex items-center">
                                            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" /> 
                                            {item.partnerId.rating.toFixed(1)}
                                            {booking.status === 'Completed' && !booking.isRated && (
                                                <button onClick={() => onRate(booking, item)} className="ml-3 text-red-500 font-semibold hover:underline">Rate Partner</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className='text-sm text-gray-500 mt-1'>Searching for a partner...</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-gray-800 mb-2">Payment Summary</h4>
                <p className='text-xl font-bold text-gray-800'>₹{booking.totalPrice.toFixed(2)}</p>
                <div className="text-sm mt-1 space-y-1">
                    <p className="text-green-600">Paid: ₹{booking.amountPaid.toFixed(2)}</p>
                    {booking.amountDue > 0 && <p className="text-red-600">Due: ₹{booking.amountDue.toFixed(2)}</p>}
                </div>
            </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t">
        {['Pending', 'Confirmed', 'Partially Assigned', 'Searching'].includes(booking.status) && (
          <div className="grid grid-cols-3 gap-2 text-sm font-medium">
            <a 
              href={assignedPartner?.mobileNumber ? `tel:${assignedPartner.mobileNumber}` : undefined}
              onClick={(e) => !assignedPartner?.mobileNumber && e.preventDefault()}
              className={`flex items-center justify-center p-2 rounded-md bg-gray-100 hover:bg-gray-200 ${!assignedPartner?.mobileNumber ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Phone className="w-4 h-4 mr-2" />Call Partner
            </a>
            <button onClick={handleReschedule} className="flex items-center justify-center p-2 rounded-md bg-gray-100 hover:bg-gray-200">
              <Clock className="w-4 h-4 mr-2" />Reschedule
            </button>
            <button onClick={handleCancel} className="flex items-center justify-center p-2 rounded-md text-red-600 hover:bg-red-50">
              <XCircle className="w-4 h-4 mr-2" />Cancel
            </button>
          </div>
        )}
        {showPayLater ? (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-center font-semibold text-orange-800 mb-3">Pay remaining ₹{booking.amountDue.toFixed(2)}</p>
                <div className="grid grid-cols-2 gap-2 text-sm font-medium">
                    <button onClick={handlePayRemaining} className="flex items-center justify-center p-2 rounded-md bg-green-100 text-green-800 hover:bg-green-200">
                        <CreditCard className="w-4 h-4 mr-2" />Pay Online
                    </button>
                    <div className="flex items-center justify-center p-2 rounded-md bg-gray-100 text-gray-800">
                        <Wallet className="w-4 h-4 mr-2" />Pay with Cash
                    </div>
                </div>
            </div>
        ) : booking.status === 'Completed' && (
          <div className="flex items-center gap-2">
            <button onClick={handleDownloadInvoice} className="flex-1 flex items-center justify-center py-2 px-4 bg-red-500 rounded-lg text-sm font-semibold text-white hover:bg-red-600"><Download className="w-4 h-4 mr-2" />Invoice</button>
          </div>
        )}
         {booking.status === 'Cancelled' && (<p className="text-sm text-center text-gray-500">This booking was cancelled.</p>)}
      </div>
    </div>
  );
}