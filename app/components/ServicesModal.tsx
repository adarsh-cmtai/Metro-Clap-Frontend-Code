"use client";

import React from 'react';
import Image from 'next/image';
import { Service } from '@/types';
import { X, ChevronRight } from 'lucide-react';

interface ServicesModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoryName: string;
    services: Service[];
    onServiceSelect: (service: Service) => void;
}

export default function ServicesModal({ isOpen, onClose, categoryName, services, onServiceSelect }: ServicesModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Services for {categoryName}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {services.map((service) => (
                            <button
                                key={service._id}
                                onClick={() => onServiceSelect(service)}
                                className="border rounded-lg text-left p-3 hover:bg-red-50 hover:border-red-300 transition-all group flex flex-col"
                            >
                                <div className="relative w-full h-32 rounded-md overflow-hidden mb-3">
                                    <Image src={service.imageUrl || '/placeholder.png'} alt={service.name} fill className="object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800">{service.name}</p>
                                </div>
                                <div className="mt-2 text-sm text-red-600 font-bold flex items-center justify-end">
                                    Select <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                </div>
                            </button>
                        ))}
                    </div>
                    {services.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No services found in this category.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
