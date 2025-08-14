"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppSelector } from '@/app/store/hooks';
import { Review } from '@/types';
import { Star, Trash2, ShieldCheck, ShieldOff, Search, ChevronDown, Loader2 } from 'lucide-react';

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
    ))}
  </div>
);

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  
  const { token } = useAppSelector(state => state.auth);

  const fetchReviews = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
        const config = { 
            headers: { Authorization: `Bearer ${token}` },
            params: { search: searchQuery, rating: ratingFilter }
        };
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const { data } = await axios.get(`${backendUrl}/api/admin/reviews`, config);
        setReviews(data);
    } catch (err) {
        setError("Failed to fetch reviews.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
        fetchReviews();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, ratingFilter, token]);

  const handleToggleApproval = async (review: Review) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      await axios.put(`${backendUrl}/api/admin/reviews/${review._id}`, { isApproved: !review.isApproved }, config);
      fetchReviews();
    } catch (err) {
      console.error("Failed to update review status");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this review?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      await axios.delete(`${backendUrl}/api/admin/reviews/${id}`, config);
      fetchReviews();
    } catch (err) {
      console.error("Failed to delete review");
    }
  };
  
  return (
    <div className="space-y-8">
       <div>
        <h2 className="text-3xl font-bold text-gray-800">Reviews & Ratings</h2>
        <p className="mt-1 text-gray-500">Moderate customer feedback and monitor partner quality.</p>
      </div>

      <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
              <h3 className="font-semibold text-lg text-gray-700">Reviews Feed</h3>
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                 <div className="relative w-full sm:w-auto">
                    <input type="text" placeholder="Search customer or partner..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg"/>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                 <div className="relative w-full sm:w-auto">
                    <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} className="w-full appearance-none bg-gray-100 border rounded-lg pl-4 pr-8 py-2">
                        <option>All Ratings</option><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
                {loading ? <div className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-red-500" /></div> : 
                 error ? <div className="text-center py-10 text-red-500">{error}</div> :
                 reviews.length > 0 ? reviews.map(review => (
                    <div key={review._id} className="p-4 border rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                           <div className="flex items-center space-x-4">
                               <img src={review.customerId.avatarUrl || `https://i.pravatar.cc/150?u=${review.customerId._id}`} alt={review.customerId.name} className="w-12 h-12 rounded-full" />
                               <div>
                                   <p className="font-semibold text-gray-800">{review.customerId.name}</p>
                                   <p className="text-xs text-gray-500">Reviewed {review.partnerId.name} for <span className="font-medium text-gray-600">{review.serviceId.name}</span></p>
                               </div>
                           </div>
                           <div className="text-left sm:text-right mt-2 sm:mt-0 flex-shrink-0">
                               <StarRating rating={review.rating} />
                               <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <p className="mt-4 text-gray-600 text-sm">{review.comment}</p>
                        <div className="flex justify-end items-center mt-4 space-x-2">
                           <button onClick={() => handleToggleApproval(review)} className={`flex items-center text-xs font-semibold px-3 py-1 rounded-full ${review.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                             {review.isApproved ? <ShieldCheck className="w-4 h-4 mr-1" /> : <ShieldOff className="w-4 h-4 mr-1" />}
                             {review.isApproved ? 'Approved' : 'Pending'}
                           </button>
                           <button onClick={() => handleDeleteReview(review._id)} className="p-2 text-gray-400 hover:bg-red-100 hover:text-red-600 rounded-full">
                               <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                    </div>
                )) : <div className="text-center py-10 text-gray-500">No reviews found matching the criteria.</div>}
            </div>
          </div>
        </div>
    </div>
  );
}