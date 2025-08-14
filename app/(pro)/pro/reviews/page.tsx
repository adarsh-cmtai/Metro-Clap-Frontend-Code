// --- START OF FILE app/pro/reviews/page.tsx ---

"use client";

import { useState, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchProReviews } from '@/app/store/features/pro/proReviewsSlice';
import { ChevronDown, Loader2 } from 'lucide-react';
import RatingSummary from '@/app/(pro)/components/pro/reviews/RatingSummary';
import ReviewCard from '@/app/(pro)/components/pro/reviews/ReviewCard';

export default function RatingsAndReviewsPage() {
    const dispatch = useAppDispatch();
    const { data, status, error } = useAppSelector(state => state.proReviews);
    const { token } = useAppSelector(state => state.auth);

    const [ratingFilter, setRatingFilter] = useState('All');

    useEffect(() => {
        if (token && status === 'idle') {
            dispatch(fetchProReviews());
        }
    }, [token, status, dispatch]);

    const filteredReviews = useMemo(() => {
        if (!data) return [];
        if (ratingFilter === 'All') {
            return data.reviews;
        }
        return data.reviews.filter(review => review.rating === parseInt(ratingFilter, 10));
    }, [ratingFilter, data]);
    
    if (status === 'loading' || status === 'idle') {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-red-500" /></div>;
    }
    
    if (status === 'failed' || !data) {
        return <div className="text-center py-20 text-red-500">{error || "Could not load reviews."}</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Ratings & Reviews</h1>
                <p className="text-gray-500 mt-1">See what your customers are saying about your service.</p>
            </div>

            <RatingSummary summary={data.summary} />

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-800">All Reviews ({data.reviews.length})</h2>
                    <div className="relative w-full sm:w-auto">
                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="w-full appearance-none bg-gray-100 border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="All">Filter by Rating</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-6">
                    {filteredReviews.length > 0 ? (
                        filteredReviews.map((review) => <ReviewCard key={review._id} review={review} />)
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No reviews found for this rating.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- END OF FILE app/pro/reviews/page.tsx ---