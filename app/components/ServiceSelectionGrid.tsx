"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home, Sparkles, Sofa, Bath, Bug, Layers, Armchair, Factory, Wind, Refrigerator, Bed, 
  CookingPot, Package, Gem, Briefcase, PaintRoller, ShieldCheck, Sun, Scissors, Loader2
} from "lucide-react";
import { Service } from "@/types";
import api from "@/lib/api";

const serviceVisuals: { [key: string]: { icon: React.ElementType, bgColor: string } } = {
  "Home Deep Cleaning": { icon: Home, bgColor: "bg-blue-100/60" },
  "Sofa Shampooing": { icon: Sofa, bgColor: "bg-purple-100/60" },
  "Bathroom Cleaning": { icon: Bath, bgColor: "bg-cyan-100/60" },
  "Pest Control": { icon: Bug, bgColor: "bg-rose-100/60" },
  "Carpet Shampooing": { icon: Layers, bgColor: "bg-green-100/60" },
  "Dining Table Chairs": { icon: Armchair, bgColor: "bg-gray-100/80" },
  "Chimney Cleaning": { icon: Factory, bgColor: "bg-blue-100/60" },
  "Window Cleaning": { icon: Wind, bgColor: "bg-purple-100/60" },
  "Fridge Deep Cleaning": { icon: Refrigerator, bgColor: "bg-rose-100/60" },
  "Mattress Cleaning": { icon: Bed, bgColor: "bg-yellow-100/60" },
  "Kitchen Cleaning": { icon: CookingPot, bgColor: "bg-rose-100/60" },
  "Combo Offer": { icon: Package, bgColor: "bg-cyan-100/60" },
  "Marble / Floor Polishing": { icon: Gem, bgColor: "bg-rose-100/60" },
  "Office Cleaning": { icon: Briefcase, bgColor: "bg-gray-100/80" },
  "Home Painting": { icon: PaintRoller, bgColor: "bg-purple-100/60" },
  "Disinfection Services": { icon: ShieldCheck, bgColor: "bg-green-100/60" },
  "Curtain Steam Cleaning": { icon: Scissors, bgColor: "bg-purple-100/60" },
  "Exterior Cleaning": { icon: Sun, bgColor: "bg-yellow-100/60" },
  "Default": { icon: Sparkles, bgColor: "bg-gray-100/80" }
};

export default function ServiceSelectionGrid() {
  const [services, setServices] = useState<Service[]>([]);
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
    <section className="relative bg-white py-10 sm:py-10 overflow-hidden">
        <div className="absolute top-10 left-40 w-40 h-40 bg-pink-100 rounded-full filter blur-xl opacity-60 -z-10"></div>
        <div className="absolute top-20 right-40 w-40 h-40 bg-blue-100 rounded-full filter blur-xl opacity-60 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block border border-red-200 text-red-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
            Complete Cleaning Solutions
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-800">
            Professional Services
            <br/>
            <span className="text-red-600">At Your Doorstep</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-neutral-500">
            From deep cleaning to specialized services, we offer comprehensive solutions for all your cleaning needs
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-48">
              <Loader2 className="w-10 h-10 animate-spin text-red-500" />
            </div>
          ) : (
            services.slice(0, 20).map((service) => {
              const visuals = serviceVisuals[service.name] || serviceVisuals["Default"];
              return (
                <Link
                  href={`/services?categoryId=${service.category._id}`}
                  key={service._id}
                  className={`rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${visuals.bgColor}`}
                  role="button"
                >
                  <div className="bg-white w-20 h-14 rounded-xl shadow-md flex items-center justify-center mb-4">
                    {React.createElement(visuals.icon, { className: "w-7 h-7 text-neutral-500" })}
                  </div>
                  <p className="text-neutral-700 text-sm font-medium text-center">{service.name}</p>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  )
}
