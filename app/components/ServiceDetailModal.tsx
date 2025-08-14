"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Service, SubService } from '@/types';
import { useAppDispatch } from '@/app/store/hooks';
import { addToCart } from '@/app/store/features/cart/cartSlice';
import { X, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

interface ServiceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: Service | null;
}

export default function ServiceDetailModal({ isOpen, onClose, service }: ServiceDetailModalProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();

    if (!isOpen || !service) return null;

    const handleAddToCart = (subService: SubService) => {
        dispatch(addToCart({
            serviceId: service._id,
            serviceName: service.name,
            serviceImage: service.imageUrl || '',
            subService: subService,
            quantity: 1,
            price: subService.price
        }));

        toast.success(`${subService.name} added to cart!`);
        onClose();
        router.push('/services');
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Select an option for {service.name}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <ul className="space-y-3">
                        {service.subServices?.map((sub) => (
                            <li key={sub._id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div>
                                    <p className="font-semibold text-gray-800">{sub.name}</p>
                                    <p className="text-sm text-gray-500 mt-1">{sub.description}</p>
                                    <div className="mt-2 text-sm">
                                        <span className="text-gray-600">Duration: <span className="font-bold text-black">{sub.duration} mins</span></span>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex flex-col items-end sm:items-center gap-2">
                                    <p className="font-bold text-lg text-gray-800">₹{sub.price}</p>
                                    <button
                                        onClick={() => handleAddToCart(sub)}
                                        className="inline-flex items-center justify-center bg-red-50 text-red-600 font-semibold px-4 py-2 rounded-lg text-sm transition-colors hover:bg-red-600 hover:text-white"
                                    >
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Add to Cart
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {(!service.subServices || service.subServices.length === 0) && (
                        <p className="text-center text-gray-500 py-8">No specific options available for this service.</p>
                    )}
                </div>
            </div>
        </div>
    );
}