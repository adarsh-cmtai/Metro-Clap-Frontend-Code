"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchPartnerDetails } from "@/app/store/features/admin/adminPartnerDetailsSlice";
import { Loader2, BookMarked, Wallet, Star } from "lucide-react";
import PartnerProfileCard from "./PartnerProfileCard";
import PartnerBookingHistory from "./PartnerBookingHistory";
import PartnerEarnings from "./PartnerEarnings";
import PartnerReviews from "./PartnerReviews";

type Tab = 'bookings' | 'earnings' | 'reviews';

export default function PartnerDetailsPage() {
    const params = useParams();
    const dispatch = useAppDispatch();
    const { details, status } = useAppSelector(state => state.adminPartnerDetails);
    const [activeTab, setActiveTab] = useState<Tab>('bookings');
    
    const partnerId = params.id as string;

    useEffect(() => {
        if (partnerId) {
            dispatch(fetchPartnerDetails(partnerId));
        }
    }, [dispatch, partnerId]);

    const renderTabContent = () => {
        if (!details) return null;
        switch(activeTab) {
            case 'bookings':
                return <PartnerBookingHistory bookings={details.bookings} />;
            case 'earnings':
                return <PartnerEarnings earnings={details.earnings} />;
            case 'reviews':
                return <PartnerReviews reviews={details.reviews} />;
            default:
                return null;
        }
    };
    
    if (status === 'loading' || !details) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-red-500" /></div>;
    }

    // Pass the calculated average rating to the profile card
    const partnerWithCorrectRating = {
        ...details.user,
        rating: details.reviews.summary.avgRating
    };

    return (
        <div className="space-y-6">
            <PartnerProfileCard partner={partnerWithCorrectRating} />

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('bookings')} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'bookings' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><BookMarked className="mr-2"/> Bookings</button>
                    <button onClick={() => setActiveTab('earnings')} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'earnings' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><Wallet className="mr-2"/> Earnings</button>
                    <button onClick={() => setActiveTab('reviews')} className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><Star className="mr-2"/> Reviews</button>
                </nav>
            </div>

            <div>
                {renderTabContent()}
            </div>
        </div>
    );
}