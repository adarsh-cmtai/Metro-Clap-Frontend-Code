"use client";

import { useEffect } from 'react';
import Link from "next/link";
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchCustomerDashboard } from '@/app/store/features/customer/dashboardSlice';
import UpcomingBookingCard from "@/app/(main)/components/customer/UpcomingBookingCard";
import { BookMarked, User, HelpCircle, Loader2 } from "lucide-react";

export default function CustomerDashboardPage() {
    const dispatch = useAppDispatch();
    const { user, token } = useAppSelector(state => state.auth);
    const { data, status, error } = useAppSelector(state => state.customerDashboard);

    useEffect(() => {
        if (token && status === 'idle') {
            dispatch(fetchCustomerDashboard());
        }
    }, [token, status, dispatch]);
    
    if (status === 'loading' || status === 'idle') {
        return <div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-red-500" /></div>;
    }

    if (status === 'failed' || !data) {
        return <div className="text-center py-20 text-red-500">{error || "Could not load dashboard."}</div>;
    }

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
                <p className="text-gray-500 mt-1">Here's your personal dashboard.</p>
            </div>
            
            {data.upcomingBooking && <UpcomingBookingCard booking={data.upcomingBooking} />}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <Link href="/customer/bookings" className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
                    <div className="bg-red-100 p-3 rounded-full"><BookMarked className="w-6 h-6 text-red-600" /></div>
                    <div>
                        <h3 className="font-semibold text-gray-800">My Bookings</h3>
                        <p className="text-sm text-gray-500">View past & upcoming</p>
                    </div>
                 </Link>
                 <Link href="/customer/profile" className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full"><User className="w-6 h-6 text-blue-600" /></div>
                    <div>
                        <h3 className="font-semibold text-gray-800">My Profile</h3>
                        <p className="text-sm text-gray-500">Manage your details</p>
                    </div>
                 </Link>
                 <Link href="/customer/support" className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full"><HelpCircle className="w-6 h-6 text-green-600" /></div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Help Center</h3>
                        <p className="text-sm text-gray-500">Get support & answers</p>
                    </div>
                 </Link>
            </div>
        </div>
    );
}