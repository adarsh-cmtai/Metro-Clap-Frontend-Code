"use client"

import { useState } from 'react';
import { useAppDispatch } from '@/app/store/hooks';
import { declineAssignment } from '@/app/store/features/pro/proBookingsSlice';
import { X } from 'lucide-react';

interface RejectReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    itemId: string;
}

export default function RejectReasonModal({ isOpen, onClose, bookingId, itemId }: RejectReasonModalProps) {
    const dispatch = useAppDispatch();
    const [reason, setReason] = useState('');
    
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) {
            alert("Please provide a reason for declining.");
            return;
        }
        dispatch(declineAssignment({ bookingId, itemId, reason }));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Decline Assignment</h2>
                    <button onClick={onClose}><X className="w-6 h-6 text-gray-500" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                            Please provide a reason for declining this job:
                        </label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="e.g., Not available at that time, Too far, etc."
                        />
                    </div>
                    <div className="flex justify-end p-4 border-t space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600">
                            Submit Rejection
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}