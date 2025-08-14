"use client"

import { MapPin, User, Play, CheckCircle, Check, X } from 'lucide-react';
import { ProAssignedJob } from '@/types';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { startJobWithOtp, updateJobStatus, confirmAssignment } from '@/app/store/features/pro/proBookingsSlice';
import { useState } from 'react';
import RejectReasonModal from './RejectReasonModal';
import OtpVerificationModal from './OtpVerificationModal';

interface BookingCardProps {
  booking: ProAssignedJob;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const dispatch = useAppDispatch();
  const { status: jobStatus, error: jobError } = useAppSelector(state => state.proBookings);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const statusStyles: { [key: string]: { borderColor: string, textColor: string } } = {
    PendingPartnerConfirmation: { borderColor: 'border-orange-500', textColor: 'text-orange-600' },
    Assigned: { borderColor: 'border-blue-500', textColor: 'text-blue-600' },
    InProgress: { borderColor: 'border-yellow-500', textColor: 'text-yellow-600' },
    CompletedByPartner: { borderColor: 'border-purple-500', textColor: 'text-purple-600' },
    Completed: { borderColor: 'border-green-500', textColor: 'text-green-600' },
    Cancelled: { borderColor: 'border-gray-400', textColor: 'text-gray-600' },
    Rejected: { borderColor: 'border-gray-400', textColor: 'text-gray-600' },
  };
  
  const displayStatus = booking.isRejectedByMe ? 'Rejected' : booking.status;
  const currentStatusStyle = statusStyles[displayStatus] || { borderColor: 'border-gray-300', textColor: 'text-gray-600' };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address)}`;

  const handleStatusUpdate = (status: 'CompletedByPartner') => {
    dispatch(updateJobStatus({ bookingId: booking.bookingId, itemId: booking.itemId, status }));
  };
  
  const handleConfirm = () => {
    dispatch(confirmAssignment({ bookingId: booking.bookingId, itemId: booking.itemId }));
  }
  
  const handleVerifyOtp = async (otp: string) => {
    const result = await dispatch(startJobWithOtp({ bookingId: booking.bookingId, itemId: booking.itemId, otp }));
    if (startJobWithOtp.fulfilled.match(result)) {
        setIsOtpModalOpen(false);
    }
  };

  return (
    <>
      <RejectReasonModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        bookingId={booking.bookingId}
        itemId={booking.itemId}
      />
      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onVerify={handleVerifyOtp}
        loading={jobStatus === 'loading'}
        error={jobError}
      />
      <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${currentStatusStyle.borderColor}`}>
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div className="flex-1">
            <p className="font-bold text-lg text-gray-800">{booking.serviceName}</p>
            <p className={`font-semibold ${currentStatusStyle.textColor}`}>{booking.date} at {booking.time}</p>
            <p className={`text-sm font-medium mt-1 ${currentStatusStyle.textColor}`}>Status: {displayStatus.replace(/([A-Z])/g, ' $1')}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
              <User className="w-4 h-4" />
              <span>{booking.customer.name}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{booking.address}</span>
            </div>
            {booking.isRejectedByMe && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-semibold text-red-700">You rejected this assignment.</p>
                <p className="text-sm text-gray-600 mt-1">Reason: "{booking.rejectionReason}"</p>
              </div>
            )}
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col items-end space-y-2">
              {!booking.isRejectedByMe && (
                <>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 w-full sm:w-auto">
                      <MapPin className="w-5 h-5 mr-2" />
                      Navigate
                  </a>
                  {booking.status === 'PendingPartnerConfirmation' && (
                    <div className="flex space-x-2 w-full sm:w-auto">
                        <button onClick={() => setIsRejectModalOpen(true)} className="flex-1 flex items-center justify-center bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600">
                            <X className="w-5 h-5 mr-2"/>Decline
                        </button>
                        <button onClick={handleConfirm} className="flex-1 flex items-center justify-center bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600">
                            <Check className="w-5 h-5 mr-2"/>Accept
                        </button>
                    </div>
                  )}
                  {booking.status === 'Assigned' && (
                      <button onClick={() => setIsOtpModalOpen(true)} className="inline-flex items-center justify-center bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 w-full sm:w-auto">
                          <Play className="w-5 h-5 mr-2" />
                          Start Job
                      </button>
                  )}
                  {booking.status === 'InProgress' && (
                      <button onClick={() => handleStatusUpdate('CompletedByPartner')} className="inline-flex items-center justify-center bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 w-full sm:w-auto">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Mark as Complete
                      </button>
                  )}
                  {booking.status === 'Completed' && (
                      <div className="text-right">
                          <p className="text-sm text-gray-500">Your Earning</p>
                          <p className="text-2xl font-bold text-green-600">₹{booking.earnings.toLocaleString()}</p>
                      </div>
                  )}
                </>
              )}
          </div>
        </div>
      </div>
    </>
  );
}