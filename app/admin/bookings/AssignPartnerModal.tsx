"use client"

import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/app/store/hooks';
import { assignPartnerToItem } from '@/app/store/features/admin/bookingsSlice';
import api from '@/lib/api';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Partner {
    _id: string;
    name: string;
}

interface BookingItem {
    _id: string;
    serviceId: { _id: string; name?: string };
    serviceName: string;
}

interface AssignPartnerModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    item: BookingItem;
    bookingAddress: string;
}

export default function AssignPartnerModal({ isOpen, onClose, bookingId, item, bookingAddress }: AssignPartnerModalProps) {
    const dispatch = useAppDispatch();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPartner, setSelectedPartner] = useState<string>('');

    useEffect(() => {
        if (isOpen && item) {
            const fetchPartners = async () => {
                try {
                    setLoading(true);
                    const pincodeMatch = bookingAddress.match(/\b\d{6}\b/);
                    const pincode = pincodeMatch ? pincodeMatch[0] : null;
                    
                    const params: { pincode?: string; bookingId: string; itemId: string; } = {
                        bookingId,
                        itemId: item._id
                    };
                    if (pincode) {
                        params.pincode = pincode;
                    }

                    const { data } = await api.get(`/admin/partners/by-service/${item.serviceId._id}`, { params });
                    setPartners(data);
                } catch (error) {
                    toast.error("Failed to fetch eligible partners.");
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };
            fetchPartners();
        }
    }, [isOpen, item, bookingId, bookingAddress]);

    const handleAssign = () => {
        if (!selectedPartner) {
            toast.error("Please select a partner.");
            return;
        }
        dispatch(assignPartnerToItem({ bookingId, itemId: item._id, partnerId: selectedPartner }));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Assign Partner for: {item.serviceName}</h2>
                    <button onClick={onClose}><X className="w-6 h-6 text-gray-500" /></button>
                </div>
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-24">
                            <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                        </div>
                    ) : partners.length > 0 ? (
                        <select
                            value={selectedPartner}
                            onChange={(e) => setSelectedPartner(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">Select a partner</option>
                            {partners.map(p => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                    ) : (
                        <p className="text-center text-gray-500">No available partners found for this service and pincode.</p>
                    )}
                </div>
                <div className="flex justify-end p-4 border-t space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                    <button
                        onClick={handleAssign}
                        disabled={loading || !selectedPartner}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:bg-gray-400"
                    >
                        Confirm Assignment
                    </button>
                </div>
            </div>
        </div>
    );
}