// --- START OF FILE app/(pro)/components/pro/reviews/ReviewCard.tsx ---

import { Star } from 'lucide-react';
import { ProReview } from '@/types';
import { format } from 'date-fns';

interface ReviewCardProps {
    review: ProReview;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
    ))}
  </div>
);


export default function ReviewCard({ review }: ReviewCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                    <img src={review.customerId.avatarUrl || `https://i.pravatar.cc/150?u=${review.customerId.name}`} alt={review.customerId.name} className="w-12 h-12 rounded-full" />
                    <div>
                        <p className="font-semibold text-gray-800">{review.customerId.name}</p>
                        <p className="text-sm text-gray-500">{format(new Date(review.createdAt), 'PPP')}</p>
                    </div>
                </div>
                <StarRating rating={review.rating} />
            </div>
            <p className="mt-4 text-gray-600 text-sm">{review.comment}</p>
        </div>
    );
}

// --- END OF FILE app/(pro)/components/pro/reviews/ReviewCard.tsx ---