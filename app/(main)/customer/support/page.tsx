"use client";

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchRecentBookings, submitSupportTicket, resetTicketStatus } from '@/app/store/features/customer/supportSlice';
import FAQItem from '@/app/(main)/components/customer/support/FAQItem';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const faqs = [
    { q: 'How do I reschedule a booking?', a: 'You can reschedule your booking from the "My Bookings" page. Find the upcoming booking you wish to change and click the "Reschedule" button.' },
    { q: 'What is your cancellation policy?', a: 'You can cancel free of charge up to 24 hours before the service time. Cancellations within 24 hours may incur a small fee.' },
    { q: 'How is the payment processed?', a: 'We accept all major credit/debit cards, UPI, and net banking. Payment is processed securely after the service is marked as complete by our partner.' },
    { q: 'Can I trust the service professionals?', a: 'Absolutely. All our partners undergo a rigorous background check and professional training to ensure your safety and high-quality service.' },
];

export default function HelpAndSupportPage() {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector(state => state.auth);
    const { recentBookings, bookingsStatus, ticketStatus, error } = useAppSelector(state => state.customerSupport);

    const [topic, setTopic] = useState('general');
    const [message, setMessage] = useState('');
    
    useEffect(() => {
        if (token && bookingsStatus === 'idle') {
            dispatch(fetchRecentBookings());
        }
    }, [token, bookingsStatus, dispatch]);
    
    const handleTicketSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(submitSupportTicket({ topic, message }));
        if (submitSupportTicket.fulfilled.match(result)) {
            alert('Your support ticket has been submitted successfully!');
            setTopic('general');
            setMessage('');
            dispatch(resetTicketStatus());
        } else {
            alert(`Error: ${error || 'Failed to submit ticket.'}`);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Help & Support</h1>
                <p className="text-gray-500 mt-1">We're here to help. Find answers to your questions or contact us directly.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                        <div>
                            {faqs.map((faq, index) => (
                                <FAQItem key={index} question={faq.q} answer={faq.a} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                     <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Help with a recent booking</h2>
                        <div className="space-y-3">
                            {bookingsStatus === 'loading' && <div className="text-center"><Loader2 className="animate-spin text-red-500" /></div>}
                            {bookingsStatus === 'succeeded' && recentBookings.length > 0 && recentBookings.map(booking => {
                                const mainService = booking.items[0];
                                return (
                                    <div key={booking._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div>
                                            <p className="font-semibold text-sm">{mainService?.serviceId?.name || 'Service'}</p>
                                            <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(booking.bookingDate))} ago</p>
                                        </div>
                                        <button className="text-sm font-semibold text-red-600 hover:underline">Get Help</button>
                                    </div>
                                )
                            })}
                            {bookingsStatus === 'succeeded' && recentBookings.length === 0 && <p className="text-sm text-gray-500 text-center">No recent completed bookings found.</p>}
                        </div>
                    </div>

                    <form onSubmit={handleTicketSubmit} className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <MessageSquare className="w-6 h-6 mr-3 text-red-500" />
                            Contact Us
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Topic</label>
                                <select id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                                    <option value="general">General Inquiry</option>
                                    <option value="payment">Payment Issue</option>
                                    <option value="booking">Booking Problem</option>
                                    <option value="feedback">Feedback</option>
                                </select>
                            </div>
                            <div>
                                 <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                 <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                            </div>
                            <button type="submit" disabled={ticketStatus === 'loading'} className="w-full flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 disabled:bg-red-300">
                                {ticketStatus === 'loading' ? <Loader2 className="animate-spin w-5 h-5" /> : <><Send className="w-4 h-4 mr-2" /> Submit Ticket</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}