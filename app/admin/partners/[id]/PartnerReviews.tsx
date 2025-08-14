import { AdminPartnerDetails, Review } from "@/types";
import { Star } from "lucide-react";
import { format } from "date-fns";

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
    ))}
  </div>
);

export default function PartnerReviews({ reviews }: { reviews: AdminPartnerDetails['reviews'] }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                    <p className="text-4xl font-bold">{reviews.summary.avgRating.toFixed(1)}</p>
                    <StarRating rating={Math.round(reviews.summary.avgRating)} />
                    <p className="text-xs text-gray-500">({reviews.summary.totalReviews} reviews)</p>
                </div>
            </div>
            <div className="space-y-4">
                {reviews.list.map(review => (
                    <div key={review._id} className="border-t pt-4">
                        <div className="flex justify-between">
                            <div>
                                <p className="font-semibold">{review.customerId.name}</p>
                                <p className="text-xs text-gray-500">{format(new Date(review.createdAt), 'PP')}</p>
                            </div>
                            <StarRating rating={review.rating} />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}