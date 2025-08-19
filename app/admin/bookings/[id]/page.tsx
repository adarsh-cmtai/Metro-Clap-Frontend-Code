"use client";

import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  fetchBookingDetails,
  broadcastBooking,
  initiatePayout,
  cancelAndRefund,
} from "@/app/store/features/admin/bookingsSlice";
import AssignPartnerModal from "@/app/admin/bookings/AssignPartnerModal";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import { Loader2, CheckCircle, Banknote, User, AlertCircle, MessageSquare, Undo2, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ServiceInfo {
  _id: string;
  name?: string;
}

interface PartnerInfo {
  _id: string;
  name?: string;
  bankDetails?: {
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    vpa?: string;
  };
}

interface RejectionInfo {
    partnerId: { _id: string; name: string };
    reason: string;
}

interface BookingItem {
  _id: string;
  serviceId: ServiceInfo;
  serviceName: string;
  quantity: number;
  totalPrice: number;
  partnerId?: PartnerInfo | null;
  status: string;
  payoutStatus: 'Pending' | 'Paid';
  rejectedBy?: RejectionInfo[];
}

interface Booking {
  _id: string;
  bookingId: string;
  items?: BookingItem[];
  status: string;
  bookingDate: string;
  paymentMethod?: 'Online' | 'COD';
  paymentStatus?: 'Pending' | 'Paid' | 'Partially Paid' | 'Failed' | 'Refunded';
  amountPaid?: number;
  customerId?: { name?: string; mobileNumber?: string };
  address?: string;
  paymentDetails?: {
      refundDetails?: {
          refundId?: string;
          refundDate?: string;
      }
  }
}

const statusColors: { [key: string]: string } = {
    'Pending Assignment': 'text-gray-600',
    'PendingPartnerConfirmation': 'text-orange-600',
    'Assigned': 'text-blue-600',
    'InProgress': 'text-yellow-600',
    'CompletedByPartner': 'text-purple-600',
    'Completed': 'text-green-600',
};

export default function BookingDetailsPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const { singleBooking, status } = useAppSelector(
    (state) => state.adminBookings
  );
  
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', onConfirm: () => {} });
  const [currentItemToAssign, setCurrentItemToAssign] = useState<BookingItem | null>(null);

  const bookingId = params.id as string;

  useEffect(() => {
    if (bookingId) {
      dispatch(fetchBookingDetails(bookingId));
    }
  }, [dispatch, bookingId]);

  const handleBroadcast = () => {
    setModalContent({
        title: 'Broadcast Booking',
        message: 'Are you sure you want to broadcast this job to all available partners?',
        onConfirm: () => dispatch(broadcastBooking(bookingId))
    });
    setIsConfirmModalOpen(true);
  };
  
  const handleOpenAssignModal = (item: BookingItem) => {
    setCurrentItemToAssign(item);
    setIsAssignModalOpen(true);
  };

  const handlePayout = (itemId: string) => {
    setModalContent({
        title: 'Confirm Payout',
        message: 'This will initiate the payout to the partner. This action cannot be undone.',
        onConfirm: () => dispatch(initiatePayout({ bookingId, itemId }))
    });
    setIsConfirmModalOpen(true);
  };

  const handleCancelAndRefund = () => {
      const booking = singleBooking as Booking;
      let message: React.ReactNode = 'Are you sure you want to cancel this booking?';
      if (booking.amountPaid && booking.amountPaid > 0) {
          message = <>This will cancel the booking and refund <strong className="font-bold">₹{booking.amountPaid}</strong> to the customer. Are you sure?</>;
      }
      setModalContent({
          title: 'Cancel Booking',
          message: message,
          onConfirm: () => dispatch(cancelAndRefund(bookingId))
      });
      setIsConfirmModalOpen(true);
  }

  if (status === "loading" || !singleBooking) {
    return (
      <div className="text-center py-20">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-500" />
      </div>
    );
  }

  const booking = singleBooking as Booking;
  const itemReadyForPayout = booking.items?.find(item => item.status === 'CompletedByPartner' && item.payoutStatus === 'Pending');
  const canBeCancelled = booking.status !== 'Cancelled' && booking.status !== 'Completed';

  return (
    <TooltipProvider>
      {currentItemToAssign && (
        <AssignPartnerModal 
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          bookingId={booking._id}
          item={currentItemToAssign}
          bookingAddress={booking.address || ''}
        />
      )}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={modalContent.onConfirm}
      />
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Booking Details</h2>
            <p className="mt-1 font-mono text-gray-500">
              ID: {booking.bookingId}
            </p>
          </div>
          <div className="flex space-x-2">
            {booking.status === "Pending" && (
              <button
                onClick={handleBroadcast}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600"
              >
                Broadcast to Partners
              </button>
            )}
            {canBeCancelled && (
              <button 
                onClick={handleCancelAndRefund}
                className={`flex items-center text-white px-4 py-2 rounded-lg font-semibold transition-colors ${booking.amountPaid && booking.amountPaid > 0 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover:bg-red-600'}`}
              >
                {booking.amountPaid && booking.amountPaid > 0 ? <Undo2 className="w-4 h-4 mr-2"/> : <XCircle className="w-4 h-4 mr-2"/>}
                {booking.amountPaid && booking.amountPaid > 0 ? 'Cancel & Refund' : 'Cancel Booking'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4 border-b pb-2">
                Service & Assignment Details
              </h3>
              <div className="space-y-4 divide-y">
                {booking.items?.length ? (
                  booking.items.map((item) => (
                    <div key={item._id} className="pt-4 first:pt-0">
                      <div className="flex justify-between items-start">
                        <div>
                           <p className="font-bold text-gray-700">{item.serviceName || item.serviceId?.name || "N/A"}</p>
                           <p className="text-sm text-gray-500">Qty: {item.quantity} | Price: ₹{item.totalPrice}</p>
                           <p className={`text-sm ${statusColors[item.status] || 'text-gray-500'}`}>
                                Item Status: <span className="font-medium">{item.status.replace(/([A-Z])/g, ' $1')}</span>
                           </p>
                        </div>
                        <div className='flex flex-col items-end space-y-2'>
                         {(item.status === 'Pending Assignment') && (
                            <button 
                                onClick={() => handleOpenAssignModal(item)}
                                className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-green-600"
                            >
                                Assign Partner
                            </button>
                         )}
                         {item.status === 'CompletedByPartner' && item.payoutStatus === 'Pending' && (
                             <button 
                                onClick={() => handlePayout(item._id)}
                                className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-indigo-600"
                            >
                                Pay Partner (₹{item.totalPrice * 0.8})
                            </button>
                         )}
                        </div>
                      </div>
                       <div className="mt-2 pl-4 border-l-2">
                          <p className="text-sm font-semibold">Assigned Partner:</p>
                          <p className="text-sm text-gray-600">{item.partnerId ? item.partnerId.name : "Not Assigned"}</p>
                          {item.payoutStatus === 'Paid' && (
                            <p className="text-sm text-green-600 font-semibold flex items-center mt-1"><CheckCircle className='w-4 h-4 mr-1'/>Paid</p>
                          )}
                          {item.rejectedBy && item.rejectedBy.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm font-semibold text-red-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/>Rejection History:</p>
                                <ul className="list-disc list-inside pl-2 text-xs text-gray-500">
                                    {item.rejectedBy.map((rejection, index) => (
                                        <li key={index}>
                                            <strong>{rejection.partnerId.name}:</strong> "{rejection.reason}"
                                        </li>
                                    ))}
                                </ul>
                            </div>
                          )}
                       </div>
                    </div>
                  ))
                ) : (
                  <p>No service items found in this booking.</p>
                )}
              </div>
            </div>

             <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-4 border-b pb-2">
                  Booking & Payment Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <p><strong>Overall Status:</strong> {booking.status}</p>
                    <p><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleString()}</p>
                    <p><strong>Payment Method:</strong> {booking.paymentMethod || 'N/A'}</p>
                    <p><strong>Payment Status:</strong> {booking.paymentStatus || 'N/A'}</p>
                    <p className="text-green-600"><strong>Amount Paid:</strong> ₹{booking.amountPaid || 0}</p>
                    {booking.paymentStatus === 'Refunded' && (
                        <p className="text-blue-600"><strong>Amount Refunded:</strong> ₹{booking.amountPaid || 0}</p>
                    )}
                </div>
                 {booking.paymentStatus === 'Refunded' && booking.paymentDetails?.refundDetails?.refundId && (
                    <p className="text-sm text-gray-500 mt-2">Refund ID: {booking.paymentDetails.refundDetails.refundId}</p>
                 )}
              </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4 border-b pb-2">
                Customer Information
              </h3>
              <p>
                <strong>Name:</strong> {booking.customerId?.name || "N/A"}
              </p>
              <p>
                <strong>Contact:</strong> {booking.customerId?.mobileNumber || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {booking.address || "N/A"}
              </p>
            </div>
          </div>
          <div className="md:col-span-1">
             {itemReadyForPayout && itemReadyForPayout.partnerId && (
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Partner Payout Details</h3>
                    <div>
                        <p className="text-sm text-gray-500 flex items-center"><User className="w-4 h-4 mr-2"/>Partner</p>
                        <p className="font-medium">{itemReadyForPayout.partnerId.name}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500 flex items-center"><Banknote className="w-4 h-4 mr-2"/>Payout Method</p>
                         {itemReadyForPayout.partnerId.bankDetails?.vpa ? (
                            <p className="font-medium">UPI: {itemReadyForPayout.partnerId.bankDetails.vpa}</p>
                        ) : itemReadyForPayout.partnerId.bankDetails?.accountNumber ? (
                             <div className="text-sm">
                                <p><strong>A/C Holder:</strong> {itemReadyForPayout.partnerId.bankDetails.accountHolderName}</p>
                                <p><strong>A/C No:</strong> {itemReadyForPayout.partnerId.bankDetails.accountNumber}</p>
                                <p><strong>IFSC:</strong> {itemReadyForPayout.partnerId.bankDetails.ifscCode}</p>
                             </div>
                        ) : (
                            <p className="text-red-500">No payout details found.</p>
                        )}
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
