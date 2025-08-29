"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Service, SubService } from '@/types';
import { useAppDispatch } from '@/app/store/hooks';
import { addToCart } from '@/app/store/features/cart/cartSlice';
import { X, Clock, Check, XCircle, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface SubServiceAddToCartModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: Service | null;
}

const AccordionItem = ({ id, title, children, openAccordion, setOpenAccordion }: { id: string; title: string; children: React.ReactNode; openAccordion: string | null; setOpenAccordion: (id: string | null) => void; }) => (
    <div className="border-b border-gray-200">
        <button onClick={() => setOpenAccordion(openAccordion === id ? null : id)} className="w-full flex justify-between items-center py-4 text-left font-semibold text-gray-800">
            <span>{title}</span>
            <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${openAccordion === id ? 'transform rotate-180' : ''}`} />
        </button>
        {openAccordion === id && <div className="pb-4 text-gray-700">{children}</div>}
    </div>
);

export default function SubServiceAddToCartModal({ isOpen, onClose, service }: SubServiceAddToCartModalProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [selectedSubService, setSelectedSubService] = useState<SubService | null>(null);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && service && service.subServices && service.subServices.length > 0) {
            setSelectedSubService(service.subServices[0]);
        } else {
            setSelectedSubService(null);
        }
    }, [isOpen, service]);

    if (!isOpen || !service) return null;

    const handleAddToCart = () => {
        if (selectedSubService) {
            dispatch(addToCart({
                serviceId: service._id,
                serviceName: service.name,
                serviceImage: service.imageUrl || '',
                subService: selectedSubService,
                quantity: 1,
                price: selectedSubService.price
            }));
            toast.success(`${selectedSubService.name} added to cart!`);
            onClose();
            router.push('/services');
        }
    };

    const priceToShow = selectedSubService?.price ?? service?.price ?? 0;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col h-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b flex-shrink-0">
                    <h2 className="text-2xl font-bold text-red-700">{service.name}</h2>
                    <p className="text-sm text-gray-500">Starts from ₹{service.price}</p>
                </header>

                <main className="overflow-y-auto p-6 space-y-8">
                    {service.subServices && service.subServices.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-3 text-lg">Select Service Type</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {service.subServices.map(option => (
                                    <button
                                        key={option._id}
                                        onClick={() => setSelectedSubService(option)}
                                        className={`border-2 rounded-lg text-left transition-all duration-200 overflow-hidden ${selectedSubService?._id === option._id ? 'border-red-500' : 'border-gray-300 hover:border-red-400'}`}
                                    >
                                        <Image
                                            src={option.imageUrl || service.imageUrl || 'https://i.imgur.com/gSNoY2j.png'}
                                            alt={option.name}
                                            width={150}
                                            height={150}
                                            className="w-full h-24 object-cover"
                                        />
                                        <div className="p-2">
                                            <p className="font-bold text-gray-800 text-sm line-clamp-2">{option.name}</p>
                                            <p className="font-semibold text-red-600 text-xs mt-1">₹{option.price}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {service.inclusions && service.inclusions.length > 0 && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h3 className="font-semibold text-green-800 mb-3">What's Included?</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    {service.inclusions.map((item, i) => <li key={i} className="flex items-start"><Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />{item}</li>)}
                                </ul>
                            </div>
                        )}
                        {service.exclusions && service.exclusions.length > 0 && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <h3 className="font-semibold text-red-800 mb-3">What's Excluded?</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    {service.exclusions.map((item, i) => <li key={i} className="flex items-start"><XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />{item}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <h3 className="font-semibold mb-2 text-lg flex items-center"><Clock className="w-5 h-5 mr-2 text-gray-500" />Duration</h3>
                        <p className="text-gray-600">{service.duration}</p>
                    </div>

                    {service.howItWorks && service.howItWorks.length > 0 &&
                        <div>
                            <h3 className="font-semibold mb-4 text-lg">🔦 How It Works</h3>
                            <ol className="space-y-4">
                                {service.howItWorks.map((step, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="flex-shrink-0 mr-4 mt-1 h-8 w-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">{index + 1}</span>
                                        <div>
                                            <strong className="block text-red-600">{step.title}</strong>
                                            <p className="text-gray-600">{step.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    }

                    {service.faqs && service.faqs.length > 0 && (
                        <div className="rounded-lg border border-gray-200 bg-white">
                            <AccordionItem id="faqs" title="❓ Frequently Asked Questions" openAccordion={openAccordion} setOpenAccordion={setOpenAccordion}>
                                <div className="space-y-4">
                                    {service.faqs.map((faq, i) => (
                                        <div key={i}>
                                            <p className="font-semibold text-gray-800">{faq.question}</p>
                                            <p className="text-gray-600 whitespace-pre-line">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </AccordionItem>
                        </div>
                    )}
                </main>

                <footer className="p-4 border-t bg-white flex justify-between items-center rounded-b-xl flex-shrink-0">
                    <div className="font-bold text-2xl text-gray-800">₹{priceToShow.toLocaleString('en-IN')}</div>
                    <button onClick={handleAddToCart} disabled={!selectedSubService} className="bg-red-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"> Add to Cart </button>
                </footer>
            </div>
        </div>
    );
}
