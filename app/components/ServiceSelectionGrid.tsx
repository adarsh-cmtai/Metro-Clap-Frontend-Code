"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Loader2,
  Home, // Assuming you might want specific icons later, keeping some for reference
  Sofa,
  Bath,
  Bug,
  Lightbulb,
  Wrench
} from "lucide-react";
import { Service } from "@/types";
import api from "@/lib/api";

// Enhanced service visuals for a more vibrant and distinct look
const serviceVisuals: { [key: string]: { bgColor: string } } = {
  "Home Deep Cleaning": { bgColor: "bg-blue-50" },
  "Sofa Shampooing": { bgColor: "bg-purple-50" },
  "Bathroom Cleaning": { bgColor: "bg-cyan-50" },
  "Pest Control": { bgColor: "bg-rose-50" },
  "Carpet Shampooing": { bgColor: "bg-green-50" },
  "Dining Table Chairs": { bgColor: "bg-yellow-50" },
  "Chimney Cleaning": { bgColor: "bg-orange-50" },
  "Window Cleaning": { bgColor: "bg-teal-50" },
  "Fridge Deep Cleaning": { bgColor: "bg-red-50" },
  "Mattress Cleaning": { bgColor: "bg-lime-50" },
  "Kitchen Cleaning": { bgColor: "bg-pink-50" },
  "Combo Offer": { bgColor: "bg-indigo-50" },
  "Marble / Floor Polishing": { bgColor: "bg-amber-50" },
  "Office Cleaning": { bgColor: "bg-gray-50" },
  "Home Painting": { bgColor: "bg-blue-50" },
  "Disinfection Services": { bgColor: "bg-green-50" },
  "Curtain Steam Cleaning": { bgColor: "bg-purple-50" },
  "Exterior Cleaning": { bgColor: "bg-yellow-50" },
  "Default": { bgColor: "bg-gray-50" }
};

export default function ServiceSelectionGrid() {
  const [services, setServices] = useState<Service[]>([]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section className="relative bg-white py-12 sm:py-16 overflow-hidden">
      {/* Background blobs for a soft, modern feel */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob -z-10"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 -z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 tracking-wide">
            <Sparkles className="h-4 w-4 text-red-500" />
            Complete Cleaning Solutions
          </span>
          <h2 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Our Professional Services
            <br className="hidden md:inline" />
            <span className="text-[#E51D2A]">At Your Doorstep</span>
          </h2>
          <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-600">
           From deep cleaning to specialized services, we offer comprehensive solutions for all your cleaning needs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl shadow-inner">
              <Loader2 className="w-12 h-12 animate-spin text-[#E51D2A] mb-4" />
              <p className="text-gray-600 text-lg font-medium">Loading Services...</p>
            </div>
          ) : (
            services.slice(0, 24).map((service) => { // Increased slice to show more if available
              const visuals = serviceVisuals[service.name] || serviceVisuals["Default"];
              return (
                <Link
                  href={`/services?categoryId=${service.category._id}`}
                  key={service._id}
                  className={`group relative flex flex-col items-center justify-center p-5 rounded-2xl shadow-sm border border-transparent transition-all duration-300 ease-out hover:shadow-lg hover:border-[#E51D2A] hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-[#E51D2A] ${visuals.bgColor}`}
                  role="button"
                  aria-label={`View details for ${service.name}`}
                >
                  <div className="relative bg-white w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-lg flex items-center justify-center mb-4 overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={service.imageUrl || "/placeholder-service.jpg"} // Use a more descriptive placeholder
                      alt={service.name}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize image loading
                    />
                  </div>
                  <p className="text-gray-800 text-base sm:text-lg font-semibold text-center leading-snug group-hover:text-[#E51D2A] transition-colors duration-300">
                    {service.name}
                  </p>
                </Link>
              );
            })
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
