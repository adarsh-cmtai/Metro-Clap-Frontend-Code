"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Service } from '@/types';
import { X, ChevronRight } from 'lucide-react';

interface SubServiceSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: Service | null;
}

export default function SubServiceSelectionModal({ isOpen, onClose, service }: SubServiceSelectionModalProps) {
    const router = useRouter();

    if (!isOpen || !service) return null;

    const handleSubServiceClick = () => {
        router.push(`/services?categoryId=${service.category._id}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Select a service for {service.name}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <ul className="space-y-3">
                        {service.subServices?.map((sub) => (
                            <li key={sub._id}>
                                <button
                                    onClick={handleSubServiceClick}
                                    className="w-full text-left p-4 border rounded-lg hover:bg-red-50 hover:border-red-300 transition-all group"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-gray-800">{sub.name}</p>
                                            <p className="text-sm text-gray-500">{sub.description}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-transform group-hover:translate-x-1" />
                                    </div>
                                    <div className="mt-2 pt-2 border-t flex justify-between text-sm">
                                        <span className="text-gray-600">Price: <span className="font-bold text-black">₹{sub.price}</span></span>
                                        <span className="text-gray-600">Duration: <span className="font-bold text-black">{sub.duration} mins</span></span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                    {(!service.subServices || service.subServices.length === 0) && (
                        <p className="text-center text-gray-500 py-8">No specific sub-services available. Please proceed to the services page to book.</p>
                    )}
                </div>
            </div>
        </div>
    );
}