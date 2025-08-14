// --- START OF FILE app/(pro)/components/pro/reviews/RatingSummary.tsx ---

import { Star } from 'lucide-react';
import { ProRatingSummary } from '@/types';

interface RatingSummaryProps {
    summary: ProRatingSummary;
}

export default function RatingSummary({ summary }: RatingSummaryProps) {
    const { totalReviews, avgRating, ratingDistribution } = summary;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Ratings</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                <div className="text-center">
                    <p className="text-5xl font-bold text-gray-800">{avgRating.toFixed(1)}</p>
                    <div className="flex justify-center mt-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-6 h-6 ${i < Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{totalReviews} ratings</p>
                </div>
                <div className="w-full flex-1">
                    <div className="space-y-1">
                        {ratingDistribution.map(item => (
                            <div key={item.stars} className="flex items-center gap-2">
                                <span className="text-sm font-medium">{item.stars} star</span>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: totalReviews > 0 ? `${(item.count / totalReviews) * 100}%` : '0%' }}></div>
                                </div>
                                <span className="text-sm text-gray-500 w-8 text-right">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- END OF FILE app/(pro)/components/pro/reviews/RatingSummary.tsx ---