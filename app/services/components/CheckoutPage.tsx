"use client"

import React, { useState, useEffect, useCallback } from 'react';
import type { CartItem as GlobalCartItem, Address as GlobalAddress, SubService as GlobalSubService } from './types';
import { CartSummary } from './CartSummary';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { clearCart, updateQuantity } from '@/app/store/features/cart/cartSlice';
import { X, ArrowLeft, Home, Briefcase, MapPin, CheckCircle, Clock, AlertTriangle, Plus, CreditCard, Wallet } from 'lucide-react';

interface SubService extends GlobalSubService {}

interface CartItem extends GlobalCartItem {
    subService: SubService;
}

type NewAddressPayload = Omit<GlobalAddress, '_id' | 'userId'>;

interface DateInfo {
    fullDate: Date;
    dayName: string;
    dayNumber: string;
}

interface AddressSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveAndProceed: (addressData: NewAddressPayload) => void;
    serviceablePincodes: string[];
}

interface SlotSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (slotDate: Date, slotTime: string) => void;
    serviceDuration: string;
}

const MetroClapLogo = () => (
    <svg width="150" height="32" viewBox="0 0 150 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="18" height="32" rx="4" fill="#A4001C"/>
        <text x="28" y="24" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#1F2937">metroclap</text>
    </svg>
);

const InputField = ({ label, value, onChange, placeholder = '' }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input type="text" value={value} onChange={onChange} placeholder={placeholder} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition" />
    </div>
);

const AddressSelectionModal = ({ isOpen, onClose, onSaveAndProceed, serviceablePincodes }: AddressSelectionModalProps) => {
    const [line1, setLine1] = useState('');
    const [line2, setLine2] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [addressType, setAddressType] = useState<'Home' | 'Office' | 'Other'>('Home');
    const [pincodeError, setPincodeError] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        setPincodeError('');
        if (!line1 || !line2 || !city || !pincode) {
            toast.error('Please fill in all required address fields.');
            return;
        }
        if (!serviceablePincodes.includes(pincode)) {
            setPincodeError('Sorry, services are not available in this pincode yet.');
            return;
        }
        
        onSaveAndProceed({
            line1,
            line2,
            city,
            pincode,
            type: addressType,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-300">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Add New Address</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Address Type</h4>
                        <div className="flex gap-2">
                            <button onClick={() => setAddressType('Home')} className={`px-4 py-2 border rounded-full flex items-center gap-2 text-sm transition-all ${addressType === 'Home' ? 'bg-red-600 text-white border-red-600 font-semibold' : 'border-gray-300 hover:bg-gray-100'}`}><Home size={16}/> Home</button>
                            <button onClick={() => setAddressType('Office')} className={`px-4 py-2 border rounded-full flex items-center gap-2 text-sm transition-all ${addressType === 'Office' ? 'bg-red-600 text-white border-red-600 font-semibold' : 'border-gray-300 hover:bg-gray-100'}`}><Briefcase size={16}/> Office</button>
                            <button onClick={() => setAddressType('Other')} className={`px-4 py-2 border rounded-full flex items-center gap-2 text-sm transition-all ${addressType === 'Other' ? 'bg-red-600 text-white border-red-600 font-semibold' : 'border-gray-300 hover:bg-gray-100'}`}><Plus size={16}/> Other</button>
                        </div>
                    </div>

                    <InputField label="Flat, House no., Building" value={line1} onChange={e => setLine1(e.target.value)} />
                    <InputField label="Area, Street, Sector, Village" value={line2} onChange={e => setLine2(e.target.value)} />
                    
                    <div className="flex gap-4">
                        <div className="w-1/2"><InputField label="Town/City" value={city} onChange={e => setCity(e.target.value)} /></div>
                        <div className="w-1/2"><InputField label="Pincode" value={pincode} onChange={e => setPincode(e.target.value)} /></div>
                    </div>
                    {pincodeError && <p className="text-red-500 text-sm flex items-center gap-1"><AlertTriangle size={14}/>{pincodeError}</p>}
                    
                    <button onClick={handleSave} className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors text-lg mt-2">
                        Save Address
                    </button>
                </div>
            </div>
        </div>
    );
};

const SlotSelectionModal = ({ isOpen, onClose, onSave, serviceDuration }: SlotSelectionModalProps) => {
    const [dates, setDates] = useState<DateInfo[]>([]);
    const [selectedDate, setSelectedDate] = useState<DateInfo | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const timeSlots = ["Instant", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"];

    useEffect(() => {
        if (isOpen) {
            const today = new Date();
            const upcomingDates: DateInfo[] = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                upcomingDates.push({
                    fullDate: date,
                    dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    dayNumber: date.getDate().toString().padStart(2, '0'),
                });
            }
            setDates(upcomingDates);
            if (upcomingDates.length > 0) setSelectedDate(upcomingDates[0]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!selectedDate || !selectedTime) {
            toast.error("Please select a date and time slot.");
            return;
        }
        onSave(selectedDate.fullDate, selectedTime);
    };
    
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in-0 zoom-in-95 duration-300">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Select a Time Slot</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="p-6 text-center">
                    <p className="text-sm text-gray-500 mb-6">Your service will take approximately {serviceDuration}</p>
                    
                    <div className="flex justify-center gap-2 mb-6 overflow-x-auto pb-2">
                        {dates.map(date => (
                            <button key={date.fullDate.toISOString()} onClick={() => setSelectedDate(date)} className={`flex-shrink-0 p-2 w-14 border-2 rounded-lg text-center transition-all ${selectedDate?.dayNumber === date.dayNumber ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-400'}`}>
                                <span className="text-xs font-medium text-gray-500">{date.dayName}</span>
                                <span className="block font-bold text-lg">{date.dayNumber}</span>
                            </button>
                        ))}
                    </div>

                    <h3 className="text-base font-semibold mb-4 text-gray-700">Select start time of service</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {timeSlots.map(time => (
                            <button key={time} onClick={() => setSelectedTime(time)} className={`p-3 border-2 rounded-lg text-sm font-semibold transition-all ${selectedTime === time ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-red-400'}`}>
                                {time}
                            </button>
                        ))}
                    </div>
                    
                    <button onClick={handleSave} className="w-full mt-8 bg-[#A4001C] text-white font-bold py-3 rounded-lg hover:bg-red-800 transition-colors text-lg">
                        Confirm Slot
                    </button>
                </div>
            </div>
        </div>
    );
};

export function CheckoutPage({ onBack }: { onBack: () => void }) {
    const dispatch = useAppDispatch();
    const cart = useAppSelector(state => state.cart.items);
    const user = useAppSelector(state => state.auth.user);
    const [addresses, setAddresses] = useState<GlobalAddress[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<GlobalAddress | null>(null);
    const [bookingDate, setBookingDate] = useState<Date | null>(null);
    const [slotTime, setSlotTime] = useState<string | null>(null);
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [isAddressModalOpen, setAddressModalOpen] = useState(false);
    const [isSlotModalOpen, setSlotModalOpen] = useState(false);
    const [serviceablePincodes, setServiceablePincodes] = useState<string[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<'Online' | 'COD'>('Online');
    const [onlinePayOption, setOnlinePayOption] = useState<'full' | 'partial'>('full');

    const totalCartPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const partialAmount = totalCartPrice * 0.20;
    
    const loadRazorpayScript = () => new Promise(resolve => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
    
    const fetchInitialData = useCallback(async () => {
        if (!user) {
            toast.error("Please log in to continue.");
            onBack();
            return;
        }
        
        try {
            const [addressRes, pincodeRes] = await Promise.all([
                api.get<GlobalAddress[]>('/customer/addresses'),
                api.get<string[]>('/admin/pincodes')
            ]);
            setAddresses(addressRes.data);
            setServiceablePincodes(pincodeRes.data);
            if (addressRes.data.length > 0) {
                const firstValidAddr = addressRes.data.find(addr => pincodeRes.data.includes(addr.pincode));
                if (firstValidAddr) setSelectedAddress(firstValidAddr);
            }
        } catch (error) {
            toast.error("Could not fetch your data. Please try again.");
        }
    }, [onBack, user]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const handleSaveAddressAndProceed = async (newAddressData: NewAddressPayload) => {
        try {
            const { data } = await api.post<GlobalAddress>('/customer/addresses', newAddressData);
            setAddresses(currentAddresses => [...currentAddresses, data]);
            setSelectedAddress(data);
            setAddressModalOpen(false);
            toast.success("Address saved successfully!");
        } catch (error) {
            toast.error("Could not save your address.");
        }
    };
    
    const handleSaveSlot = (selectedSlotDate: Date, selectedSlotTime: string) => {
        setBookingDate(selectedSlotDate);
        setSlotTime(selectedSlotTime);
        setSlotModalOpen(false);
    };

    const handleCreateBooking = async () => {
        if (!selectedAddress || !bookingDate || !slotTime) {
            toast.error("Please select an address and a time slot.");
            return;
        }
        setBookingStatus('loading');

        if (paymentMethod === 'Online') {
            await processOnlinePayment();
        } else {
            await processCODBooking();
        }
    };
    
    const processCODBooking = async () => {
        if (!selectedAddress) return;
        const bookingPayload = {
            items: cart, bookingDate, slotTime,
            address: `${selectedAddress.line1}, ${selectedAddress.line2}, ${selectedAddress.city} - ${selectedAddress.pincode}`,
            totalPrice: totalCartPrice,
            paymentMethod: 'COD',
            amountPaid: 0,
            paymentDetails: {},
        };
        try {
            const promise = api.post('/customer/bookings', bookingPayload);
            toast.promise(promise, { loading: 'Confirming your booking...', success: 'Booking confirmed successfully!', error: 'Failed to confirm booking.' });
            await promise;
            setBookingStatus('success');
            dispatch(clearCart());
            setTimeout(() => onBack(), 2000);
        } catch (err) {
            setBookingStatus('error');
        }
    };

    const processOnlinePayment = async () => {
        if (!selectedAddress || !bookingDate || !slotTime) return;

        if (!await loadRazorpayScript()) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            setBookingStatus('error');
            return;
        }

        const amountToPay = onlinePayOption === 'full' ? totalCartPrice : partialAmount;

        try {
            const { data: order } = await api.post('/payment/create-order', { amount: amountToPay });
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "MetroClap Services",
                description: "Payment for your selected services.",
                order_id: order.id,
                handler: async (response: any) => {
                    const bookingPayload = {
                        items: cart, bookingDate, slotTime,
                        address: `${selectedAddress.line1}, ${selectedAddress.line2}, ${selectedAddress.city} - ${selectedAddress.pincode}`,
                        totalPrice: totalCartPrice,
                        paymentMethod: 'Online',
                        amountPaid: amountToPay,
                        paymentDetails: { orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id, signature: response.razorpay_signature },
                    };
                    try {
                        const promise = api.post('/customer/bookings', bookingPayload);
                        toast.promise(promise, { loading: 'Confirming your booking...', success: 'Booking confirmed successfully!', error: 'Failed to confirm booking.' });
                        await promise;
                        setBookingStatus('success');
                        dispatch(clearCart());
                        setTimeout(() => onBack(), 2000);
                    } catch (err) { setBookingStatus('error'); }
                },
                prefill: { name: user?.name, email: user?.email, contact: user?.mobileNumber },
                theme: { color: "#A4001C" }
            };
            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.on('payment.failed', () => { toast.error('Payment failed. Please try again.'); setBookingStatus('idle'); });
            paymentObject.open();
            setBookingStatus('idle');
        } catch (error) { toast.error("Could not initiate the booking process."); setBookingStatus('error'); }
    };


    const handleQuantityChange = (subServiceId: string, delta: number) => {
        dispatch(updateQuantity({ subServiceId, delta }));
    };
    
    return (
        <>
            <AddressSelectionModal isOpen={isAddressModalOpen} onClose={() => setAddressModalOpen(false)} onSaveAndProceed={handleSaveAddressAndProceed} serviceablePincodes={serviceablePincodes} />
            <SlotSelectionModal isOpen={isSlotModalOpen} onClose={() => setSlotModalOpen(false)} onSave={handleSaveSlot} serviceDuration={"4 hrs 50 min"} />

            <div className="font-sans bg-gray-50 text-gray-800 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <header className="mb-8 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                           <button onClick={onBack} className="text-gray-500 hover:text-black p-2 rounded-full hover:bg-gray-200"><ArrowLeft/></button>
                           <MetroClapLogo />
                        </div>
                    </header>
                    <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border">
                                <h3 className="text-xl font-bold mb-4">1. Select Delivery Address</h3>
                                <div className="space-y-4">
                                    {addresses.map(addr => (
                                        <label key={addr._id} className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAddress?._id === addr._id ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                                            <input type="radio" name="address" checked={selectedAddress?._id === addr._id} onChange={() => setSelectedAddress(addr)} className="mt-1 h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"/>
                                            <div className="ml-4">
                                                <div className="flex items-center gap-2 font-semibold">
                                                    {addr.type === 'Home' ? <Home size={16}/> : addr.type === 'Office' ? <Briefcase size={16}/> : <MapPin size={16}/>} {addr.type}
                                                </div>
                                                <p className="text-gray-600 text-sm">{`${addr.line1}, ${addr.line2}, ${addr.city} - ${addr.pincode}`}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <button onClick={() => setAddressModalOpen(true)} className="mt-4 text-red-600 font-semibold text-sm hover:underline">+ Add New Address</button>
                            </div>

                             <div className="bg-white p-6 rounded-xl shadow-sm border">
                                <h3 className="text-xl font-bold mb-4">2. Select Time Slot</h3>
                                {bookingDate && slotTime ? (
                                    <div className="flex justify-between items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-3 text-green-800">
                                            <CheckCircle/>
                                            <p className="font-semibold">{`${slotTime === 'Instant' ? 'Instant' : new Date(bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${slotTime}`}</p>
                                        </div>
                                        <button onClick={() => setSlotModalOpen(true)} className="text-red-600 font-semibold text-sm hover:underline">Change</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setSlotModalOpen(true)} className="w-full text-left flex justify-between items-center p-4 border-2 border-dashed rounded-lg text-gray-500 hover:border-red-500 hover:text-red-600">
                                        <div className="flex items-center gap-2"><Clock/><span>When should the professional arrive?</span></div>
                                        <span className="font-semibold">Select Slot &rarr;</span>
                                    </button>
                                )}
                            </div>

                             <div className="bg-white p-6 rounded-xl shadow-sm border">
                                <h3 className="text-xl font-bold mb-4">3. Choose Payment Method</h3>
                                <div className="space-y-4">
                                    <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'Online' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                                        <input type="radio" name="paymentMethod" value="Online" checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} className="mt-1 h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"/>
                                        <div className="ml-4 w-full">
                                            <div className="flex items-center gap-2 font-semibold"><CreditCard size={16}/> Pay Online (via Razorpay)</div>
                                            {paymentMethod === 'Online' && (
                                                <div className="mt-4 space-y-3 pl-2 border-l-2 border-red-200">
                                                    <label className="flex items-center text-sm">
                                                        <input type="radio" name="onlineOption" value="full" checked={onlinePayOption === 'full'} onChange={() => setOnlinePayOption('full')} className="h-4 w-4 text-red-600"/>
                                                        <span className="ml-2">Pay full amount: <strong>₹{totalCartPrice.toLocaleString('en-IN')}</strong></span>
                                                    </label>
                                                     <label className="flex items-center text-sm">
                                                        <input type="radio" name="onlineOption" value="partial" checked={onlinePayOption === 'partial'} onChange={() => setOnlinePayOption('partial')} className="h-4 w-4 text-red-600"/>
                                                        <span className="ml-2">Pay 20% advance: <strong>₹{partialAmount.toLocaleString('en-IN')}</strong></span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                    <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                                        <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="mt-1 h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"/>
                                        <div className="ml-4"><div className="flex items-center gap-2 font-semibold"><Wallet size={16}/> Cash on Delivery</div></div>
                                    </label>
                                </div>
                             </div>
                        </div>

                        <div className="lg:col-span-1 lg:sticky top-8 h-fit">
                            <CartSummary cart={cart} onQuantityChange={handleQuantityChange} onProceed={handleCreateBooking} />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}