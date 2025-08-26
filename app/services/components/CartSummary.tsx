import React from 'react';
import type { CartItem } from './types';

interface CartSummaryProps {
    cart: CartItem[];
    onQuantityChange: (serviceId: string, delta: number) => void;
    onProceed: () => void;
    isFirstTimeUser: boolean;
}

export function CartSummary({ cart, onQuantityChange, onProceed, isFirstTimeUser }: CartSummaryProps) {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = isFirstTimeUser ? 100 : 0;
    const totalAmount = subtotal - discount > 0 ? subtotal - discount : 0;

    return (
        <div className="space-y-6">
            <div className="rounded-lg shadow-lg border border-gray-200 bg-white">
                <div className="p-4">
                    <h3 className="text-lg font-bold mb-4">Cart Summary</h3>
                    {cart.map(item => (
                        <div key={item.subService._id} className="mt-2 py-2 border-b last:border-b-0">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-base pr-2">{item.serviceName}</p>
                                <p className="font-bold text-base whitespace-nowrap">₹{item.price.toLocaleString('en-IN')}</p>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{item.subService.name}</p>
                             <div className="flex items-center border border-gray-300 rounded-md w-fit">
                                <button onClick={() => onQuantityChange(item.subService._id, -1)} className="px-2 py-1 text-gray-600">-</button>
                                <span className="px-3 font-semibold text-gray-800">{item.quantity}</span>
                                <button onClick={() => onQuantityChange(item.subService._id, 1)} className="px-2 py-1 text-gray-600">+</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-lg bg-white p-4 border border-gray-200 text-sm">
                <h4 className="font-semibold mb-3">Payment Summary</h4>
                <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {isFirstTimeUser && (
                        <div className="flex justify-between text-green-600">
                            <span>First Booking Discount</span>
                            <span>- ₹{discount.toLocaleString('en-IN')}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-base text-gray-800 pt-2 border-t mt-2">
                        <span>To Pay</span>
                        <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
            
            <button 
                onClick={onProceed}
                className="w-full bg-red-800 text-white font-bold py-4 rounded-lg hover:bg-red-900 transition-colors flex justify-between items-center px-4"
            >
                <span>Proceed to Checkout</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </button>
        </div>
    );
}
