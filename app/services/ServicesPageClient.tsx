"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import type { CartItem, Service, CategoryWithServices } from './components/types';
import { CheckoutPage } from './components/CheckoutPage';
import api from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { addToCart, updateQuantity } from '@/app/store/features/cart/cartSlice';
import { Check } from "lucide-react";
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-green-600 mr-2 flex-shrink-0"> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" /> </svg>);
const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /> </svg>);

const ServiceModal = ({ service, isOpen, onClose, onAddToCart }: { service: Service | null; isOpen: boolean; onClose: () => void; onAddToCart: (item: CartItem) => void; }) => {
    const [selectedSubService, setSelectedSubService] = useState<any>(undefined);
    const [openAccordion, setOpenAccordion] = useState<string | null>('faqs');

    useEffect(() => {
        if (isOpen && service) {
            setSelectedSubService(service.subServices?.[0] || undefined);
            setOpenAccordion('faqs');
        }
    }, [isOpen, service]);

    if (!isOpen || !service) return null;

    const toggleAccordion = (id: string) => setOpenAccordion(openAccordion === id ? null : id);

    const AccordionItem = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
        <div className="border-b border-gray-200">
            <button onClick={() => toggleAccordion(id)} className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-800"> {title} <ChevronDownIcon isOpen={openAccordion === id} /> </button>
            {openAccordion === id && <div className="p-4 bg-gray-50 text-gray-700">{children}</div>}
        </div>
    );

    const handleAddToCartClick = () => {
        if (selectedSubService) {
            onAddToCart({
                serviceId: service._id,
                serviceName: service.name,
                serviceImage: service.imageUrl || '',
                subService: selectedSubService,
                quantity: 1,
                price: selectedSubService.price
            });
            onClose();
        }
    };

    const priceToShow = selectedSubService?.price ?? service?.price ?? 0;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="p-5 border-b sticky top-0 bg-white rounded-t-2xl z-10">
                    <h2 className="text-2xl font-bold text-red-700">{service.name}</h2>
                    <p className="text-sm text-gray-500">Starts from ₹{service.price}</p>
                </header>
                <main className="overflow-y-auto p-6 space-y-6">
                    {service.subServices && service.subServices.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-3 text-lg">Select Service Type</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                                {service.subServices.map((option) => (
                                    <button
                                        key={option._id}
                                        onClick={() => setSelectedSubService(option)}
                                        className={`border rounded-lg text-left transition-all duration-200 overflow-hidden ${selectedSubService?._id === option._id
                                            ? "border-red-500 bg-red-50 ring-2 ring-red-300"
                                            : "border-gray-300 hover:border-red-400 hover:bg-gray-50"
                                            }`}
                                    >
                                        <img
                                            src={
                                                (option as any).imageUrl ||
                                                service.imageUrl ||
                                                "https://i.imgur.com/gSNoY2j.png"
                                            }
                                            alt={option.name}
                                            className="w-full h-28 object-cover rounded-t-lg"
                                        />
                                        <div className="p-3">
                                            <p className="font-bold text-gray-800 text-base line-clamp-2">
                                                {option.name}
                                            </p>
                                            <p className="font-semibold text-red-600 text-sm mt-1">
                                                ₹{option.price}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg"> <h3 className="font-semibold text-green-800 mb-3">What's Included?</h3> <ul className="space-y-2 text-sm text-gray-700"> {service.inclusions.map((item, i) => <li key={i} className="flex items-center"><CheckIcon />{item}</li>)} </ul> </div>
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h3 className="font-semibold text-red-800 mb-3">What's Excluded?</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                {service.exclusions.map((item, i) => (
                                    <li key={i} className="flex items-center">
                                        <Check className="w-4 h-4 text-red-600 mr-2" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>                    </div>
                    <div> <h3 className="font-semibold mb-2 text-lg">🕒 Duration</h3> <p className="text-gray-600">{service.duration}</p> </div>
                    {service.howItWorks && service.howItWorks.length > 0 && <div> <h3 className="font-semibold mb-4 text-lg">🔦 How It Works</h3> <ol className="space-y-4"> {service.howItWorks.map((step, index) => (<li key={index} className="flex items-start"> <span className="flex-shrink-0 mr-4 mt-1 h-8 w-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">{index + 1}</span> <div><strong className="block text-red-600">{step.title}</strong><p className="text-gray-600">{step.description}</p></div> </li>))} </ol> </div>}
                    {service.faqs && service.faqs.length > 0 && <div className="rounded-lg border border-gray-200 bg-white"> <AccordionItem id="faqs" title="❓ Frequently Asked Questions"> <div className="space-y-4"> {service.faqs.map((faq, i) => (<div key={i}><p className="font-semibold text-gray-800">{faq.question}</p><p className="text-gray-600 whitespace-pre-line">{faq.answer}</p></div>))} </div> </AccordionItem> </div>}
                </main>
                <footer className="p-4 border-t bg-white sticky bottom-0 flex justify-between items-center rounded-b-2xl">
                    <div className="font-bold text-2xl text-gray-800">₹{priceToShow.toLocaleString('en-IN')}</div>
                    <button onClick={handleAddToCartClick} disabled={!selectedSubService} className="bg-red-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"> Add to Cart </button>
                </footer>
            </div>
        </div>
    );
};

export default function ServicesPageClient() {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();

    const [categories, setCategories] = useState<CategoryWithServices[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const selectedLocation = useAppSelector((state) => state.location.selectedLocation);
    const cart = useAppSelector((state) => state.cart.items);
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                const url = selectedLocation ? `/services/by-category?locationId=${selectedLocation._id}` : '/services/by-category';
                const { data } = await api.get(url);
                setCategories(data);
                setError(null);
            } catch (err) {
                setError("Failed to fetch services. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [selectedLocation]);

    useEffect(() => {
        const categoryId = searchParams.get('categoryId');
        if (categoryId && categoryRefs.current[categoryId]) {
            setTimeout(() => {
                categoryRefs.current[categoryId]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }, 100);
        }
    }, [searchParams, categories]);

    const handleAddToCart = (item: CartItem) => {
        dispatch(addToCart(item));
        toast.success(`${item.serviceName} added to cart!`);
    };

    const handleQuantityChange = (subServiceId: string, delta: number) => {
        dispatch(updateQuantity({ subServiceId, delta }));
    };

    const handleCategoryClick = (categoryId: string) => {
        categoryRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleOpenModal = (service: Service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const handleEditItem = (serviceId: string) => {
        const serviceToEdit = categories.flatMap(c => c.services || []).find(s => s._id === serviceId);
        if (serviceToEdit) {
            handleOpenModal(serviceToEdit);
        }
    };

    const handleProceedToCheckout = () => {
        if (!user) {
            toast.error("Please log in to proceed to checkout.");
            return;
        }
        setShowCheckout(true);
    };

    if (showCheckout) {
        return <CheckoutPage onBack={() => setShowCheckout(false)} />;
    }

    const renderCart = () => {
        if (!hasMounted) {
            return (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-white min-h-[200px]">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
            );
        }

        if (cart.length === 0) {
            return (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-white flex flex-col items-center justify-center min-h-[200px] text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 text-gray-300"> <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.344 1.087-.849l1.855-6.992a.75.75 0 00-.7-1.018H5.614M16.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM8.25 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /> </svg>
                    <p className="font-semibold">Your Cart is Empty</p>
                    <p className="text-sm">Add services to get started</p>
                </div>
            );
        }

        return (
            <div className="rounded-2xl shadow-lg border border-gray-200/80 bg-white">
                <div className="p-4 border-b border-gray-200"><h3 className="font-bold text-xl text-gray-800">My Cart</h3></div>
                <div className="p-4 space-y-4 max-h-72 overflow-y-auto">
                    {cart.map(item => (
                        <div key={item.subService._id}>
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex-grow">
                                    <p className="font-bold text-red-700">{item.serviceName}</p>
                                    <p className="text-sm text-gray-600 my-1">{item.subService.name}</p>
                                    <button onClick={() => handleEditItem(item.serviceId)} className="text-sm text-blue-600 hover:underline font-medium">Edit</button>
                                </div>
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button onClick={() => handleQuantityChange(item.subService._id, -1)} className="px-2.5 py-1 text-red-600 text-lg font-bold hover:bg-red-50 rounded-l-md">-</button>
                                    <span className="px-3 font-bold text-red-600">{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item.subService._id, 1)} className="px-2.5 py-1 text-green-600 text-lg font-bold hover:bg-green-50 rounded-r-md">+</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-gray-50 rounded-b-2xl p-4 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Total Price</p>
                        <span className="font-extrabold text-2xl text-gray-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <button onClick={handleProceedToCheckout} className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors">View Cart</button>
                </div>
            </div>
        );
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <ServiceModal service={selectedService} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddToCart={handleAddToCart} />
            <div className="font-sans bg-gray-50 text-gray-800 min-h-screen">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="py-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Our Services</h1>
                        {/* <p className="text-gray-500 mt-2 text-lg">⭐ 4.9 (51m ratings) | 5m+ bookings nationwide</p> */}
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <aside className="lg:col-span-3 lg:sticky top-8 h-fit space-y-6">
                            <div className="border border-gray-200/80 rounded-2xl p-6 bg-white shadow-sm">
                                <h3 className="font-bold mb-4 text-gray-900 text-lg">Categories</h3>
                                <div className="space-y-1">
                                    {categories.map(cat => (
                                        <div key={cat._id} onClick={() => handleCategoryClick(cat._id)} className="block w-full text-left p-3 rounded-lg text-base cursor-pointer transition-colors duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600 font-medium">
                                            {cat.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        <main className="lg:col-span-6 space-y-12">
                            {loading && <div className="text-center p-20 font-semibold text-gray-500">Loading Services...</div>}
                            {error && <div className="text-center p-20 text-red-600 bg-red-50 rounded-lg">{error}</div>}
                            {!loading && !error && categories.map(category => (
                                category.services && category.services.length > 0 && (
                                    <section key={category._id} ref={(el: HTMLDivElement | null) => {
                                        categoryRefs.current[category._id] = el;
                                    }}
                                    >
                                        <h2 className="text-3xl font-bold mb-6 text-gray-800">{category.name}</h2>
                                        <div className="space-y-6">
                                            {category.services.map(service => (
                                                <div key={service._id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200/80 p-5 flex flex-col sm:flex-row items-center gap-6">
                                                    <img src={service.imageUrl || 'https://i.imgur.com/gSNoY2j.png'} alt={service.name} className="w-full sm:w-40 h-32 object-cover rounded-xl flex-shrink-0" />
                                                    <div className="flex-grow w-full">
                                                        <h4 className="text-xl font-bold">{service.name}</h4>
                                                        <p className="text-sm text-gray-500 my-1">🕒 {service.duration}</p>
                                                        <ul className="list-none p-0 my-4 space-y-2">
                                                            {service.inclusions.slice(0, 2).map((task, i) => <li key={i} className="flex items-center text-sm text-gray-600"><CheckIcon />{task}</li>)}
                                                        </ul>
                                                        <div className="flex justify-between items-center mt-4">
                                                            <p className="font-extrabold text-lg">₹{service.price}</p>
                                                            <button className="bg-red-50 text-red-600 border border-red-200 rounded-lg py-2 px-8 font-bold transition-all duration-200 hover:bg-red-600 hover:text-white" onClick={() => handleOpenModal(service)}> Add </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )
                            ))}
                            {!loading && categories.filter(c => c.services && c.services.length > 0).length === 0 && <div className="text-center p-20 font-semibold text-gray-500 bg-white rounded-2xl">No services found for the selected location.</div>}
                        </main>

                        <aside className="lg:col-span-3 lg:sticky top-8 h-fit space-y-6">
                            {renderCart()}
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
