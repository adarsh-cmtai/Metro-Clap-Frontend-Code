"use client"

import React, { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Review } from '@/types';
import api from '@/lib/api';

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get('/services/reviews/homepage');
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="relative bg-white py-12 sm:py-12 overflow-hidden">
      <div className="absolute top-1/2 left-40 w-32 h-32 bg-green-100 rounded-full filter blur-xl opacity-60 -z-10 -translate-y-1/2"></div>
      <div className="absolute top-1/3 right-40 w-32 h-32 bg-blue-100 rounded-full filter blur-xl opacity-60 -z-10"></div>

      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <div className="inline-block border border-red-200 text-red-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Customer Reviews
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-800">
            What Our <span className="text-red-600">Customers Say</span>
          </h2>
          <p className="mt-4 text-neutral-500 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say.
          </p>
        </div>

        {loading ? (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white border border-gray-200/90 rounded-xl p-6 shadow-sm flex flex-col">
                <blockquote className="text-neutral-600 flex-grow">
                  "{review.comment}"
                </blockquote>
                <div className="flex items-center gap-1 my-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <hr className="my-4 border-t border-gray-200" />
                <div className="flex items-center gap-4">
                  <img 
                    src={review.customerId.avatarUrl || `https://ui-avatars.com/api/?name=${review.customerId.name.replace(' ', '+')}`}
                    alt={review.customerId.name}
                    className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 object-cover"
                  />
                  <div>
                    <cite className="font-semibold text-neutral-800 not-italic">{review.customerId.name}</cite>
                    <p className="text-neutral-500 text-sm">{review.serviceId.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}