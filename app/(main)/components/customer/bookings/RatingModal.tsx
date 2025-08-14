"use client";

import { useState } from 'react';
import { useAppDispatch } from '@/app/store/hooks';
import { submitReview } from '@/app/store/features/customer/bookingsSlice';
import { X, Star, Loader2 } from 'lucide-react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  serviceId: string;
  serviceName: string;
  partnerId: string;
  partnerName: string;
}

export default function RatingModal({ isOpen, onClose, bookingId, serviceId, serviceName, partnerId, partnerName }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setLoading(true);
    await dispatch(submitReview({ bookingId, partnerId, serviceId, rating, comment }));
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"><X size={24} /></button>
        <h3 className="text-xl font-bold text-center mb-2">Rate Your Experience</h3>
        <p className="text-center text-gray-600 mb-1">with <span className='font-semibold'>{partnerName}</span></p>
        <p className="text-center text-sm text-gray-500 mb-6">for {serviceName}</p>
        <form onSubmit={handleSubmit}>
            <div className="flex justify-center items-center space-x-2 mb-6">
                {[...Array(5)].map((_, i) => (
                    <button type="button" key={i} onClick={() => setRating(i + 1)}>
                        <Star className={`w-8 h-8 transition-colors ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                    </button>
                ))}
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder={`Share your experience with ${partnerName}...`} rows={4} className="w-full p-3 border rounded-lg"/>
            <button type="submit" disabled={loading} className="w-full bg-red-500 text-white p-3 rounded-lg mt-4 font-semibold flex items-center justify-center disabled:bg-red-300">
              {loading ? <Loader2 className="animate-spin" /> : 'Submit Review'}
            </button>
        </form>
      </div>
    </div>
  );
}