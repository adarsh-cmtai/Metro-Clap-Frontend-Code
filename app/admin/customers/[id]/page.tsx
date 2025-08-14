"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchCustomerDetails } from "@/app/store/features/admin/adminCustomerDetailsSlice";
import { User, Home, HelpCircle, Loader2, BookMarked } from "lucide-react";
import CustomerProfileCard from "./CustomerProfileCard";
import BookingHistory from "./BookingHistory";
import AddressList from "./AddressList";
import SupportTickets from "./SupportTickets";

type Tab = 'bookings' | 'addresses' | 'support';

export default function CustomerDetailsPage() {
    const params = useParams();
    const dispatch = useAppDispatch();
    const { details, status } = useAppSelector(state => state.adminCustomerDetails);
    const [activeTab, setActiveTab] = useState<Tab>('bookings');
    
    const customerId = params.id as string;

    useEffect(() => {
        if (customerId) {
            dispatch(fetchCustomerDetails(customerId));
        }
    }, [dispatch, customerId]);

    const renderTabContent = () => {
        if (!details) return null;
        switch(activeTab) {
            case 'bookings':
                return <BookingHistory bookings={details.bookings} />;
            case 'addresses':
                return <AddressList addresses={details.addresses} />;
            case 'support':
                return <SupportTickets tickets={details.supportTickets} />;
            default:
                return null;
        }
    };
    
    if (status === 'loading' || !details) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-red-500" /></div>;
    }

    return (
        <div className="space-y-6">
            <CustomerProfileCard customer={details.user} />

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('bookings')} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'bookings' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><BookMarked className="mr-2"/> Bookings</button>
                    <button onClick={() => setActiveTab('addresses')} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'addresses' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><Home className="mr-2"/> Addresses</button>
                    <button onClick={() => setActiveTab('support')} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'support' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><HelpCircle className="mr-2"/> Support Tickets</button>
                </nav>
            </div>

            <div>
                {renderTabContent()}
            </div>
        </div>
    );
}