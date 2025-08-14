// --- START OF FILE app/cart/page.tsx ---

"use client";

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchCart } from '@/app/store/features/cartSlice';
import { createBooking } from '@/app/store/features/customer/bookingsSlice';
import { useRouter } from 'next/navigation';
import LoginModal from '@/components/LoginModal';

export default function CartPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user, token } = useAppSelector(state => state.auth);
    const { cart } = useAppSelector(state => state.cart);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

    useEffect(() => {
        if (token) {
            dispatch(fetchCart());
        }
    }, [token, dispatch]);

    const handleProceedToBook = async () => {
        if (!user) {
            setIsLoginModalOpen(true);
            return;
        }
        if (!selectedAddress || !selectedSlot) {
            alert("Please select an address and a time slot.");
            return;
        }
        
        // In a real app, you would dispatch an action to create a booking from the cart
        alert("Booking Placed!");
        router.push('/customer/bookings');
    };

    const cartTotal = cart?.items.reduce((sum, item) => sum + item.totalPrice, 0) || 0;

    return (
        <>
            <div className="max-w-4xl mx-auto py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
                        <div className="space-y-4">
                            {!user ? (
                                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                                    <h2 className="font-semibold">Account</h2>
                                    <p className="text-sm text-gray-500 my-2">To book the service, please login or sign up</p>
                                    <button onClick={() => setIsLoginModalOpen(true)} className="w-full bg-red-600 text-white font-bold py-3 rounded-lg">LOGIN</button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-white p-6 rounded-lg shadow-sm">
                                        <h2 className="font-semibold">Address</h2>
                                        {selectedAddress ? <p>{selectedAddress}</p> : <button onClick={() => setSelectedAddress('Home - 67 Agarkar Nagar, Pune')} className="w-full bg-red-600 text-white font-bold py-3 rounded-lg mt-2">Select an Address</button>}
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm">
                                         <h2 className="font-semibold">Slot</h2>
                                         {selectedSlot ? <p>{selectedSlot.toLocaleString()}</p> : <button onClick={() => setSelectedSlot(new Date())} className="w-full bg-red-600 text-white font-bold py-3 rounded-lg mt-2">Select a Slot</button>}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="font-bold mb-4">Payment Summary</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span>Item total</span><span>₹{cartTotal}</span></div>
                                <div className="flex justify-between"><span>Taxes and Fee</span><span>₹{cartTotal > 0 ? 50 : 0}</span></div>
                            </div>
                            <div className="flex justify-between font-bold mt-4 pt-4 border-t">
                                <span>Amount to pay</span>
                                <span>₹{cartTotal > 0 ? cartTotal + 50 : 0}</span>
                            </div>
                            <button onClick={handleProceedToBook} className="w-full bg-red-600 text-white font-bold py-3 rounded-lg mt-6">
                                Proceed to Pay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
        </>
    );
}

// --- END OF FILE app/cart/page.tsx ---