"use client"

import React from 'react';
import Image from 'next/image';
import { Shield, UserCheck, Clock, Leaf } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "100% Insured & Bonded",
    description: "Complete protection for your peace of mind",
  },
  {
    icon: UserCheck,
    title: "Trained Professionals",
    description: "Background-checked and certified cleaners",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Book anytime that works for you",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Products",
    description: "Safe for your family and pets",
  },
];

export default function PremiumQuality() {
  return (
    <section className="relative bg-black text-white py-20 sm:py-28 overflow-hidden">
      <div className="absolute top-10 left-10 w-48 h-48 bg-red-900/50 rounded-full filter blur-3xl opacity-50 -z-0"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <div>
            <a href="#why-us" className="inline-block border border-red-500/80 text-red-400 px-5 py-2 rounded-full text-sm font-medium mb-6 transition hover:bg-red-500/10">
              Why Choose Us
            </a>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Premium Quality, Every Time
            </h2>
            <p className="mt-4 text-white/70 max-w-lg">
              We're not just another cleaning service. We're your partners in creating pristine, healthy environments.
            </p>

            <div className="mt-10 space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-red-900/70 w-14 h-14 rounded-lg flex items-center justify-center">
                    {React.createElement(feature.icon, { className: "w-7 h-7 text-red-400" })}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-white/60 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative h-[550px] hidden lg:block">
            <div className="absolute top-10 right-20 w-32 h-32 bg-purple-900/40 rounded-full filter blur-3xl opacity-80"></div>
            <div className="relative w-full h-full p-2 border border-white/10 rounded-2xl">
              <Image
                src="/Home/Quality.png"
                alt="Professional cleaner posing with a mop in a clean living room"
                fill
                className="object-contain rounded-xl"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}