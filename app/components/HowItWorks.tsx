"use client"

import React from 'react';
import { ChevronRight } from 'lucide-react';

const steps = [
  {
    number: "01",
    title: "Book Online",
    description: "Choose your service and preferred time slot in just a few clicks",
    isSpecial: true,
  },
  {
    number: "02",
    title: "We Arrive",
    description: "Our verified cleaning professionals arrive with all equipment",
    isSpecial: false,
  },
  {
    number: "03",
    title: "Clean & Shine",
    description: "Sit back and relax while we make your space spotless",
    isSpecial: false,
  },
  {
    number: "04",
    title: "Quality Check",
    description: "We ensure everything meets our high standards before leaving",
    isSpecial: false,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-5 sm:py-5">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <div className="inline-block border border-red-200 text-red-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Simple Process
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-800">
            How It <span className="text-[#B91C1C]">Works</span>
          </h2>
          <p className="mt-4 text-neutral-500">
            Get your space cleaned in 4 simple steps. It's that easy!
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-[29px] left-1/2 -translate-x-1/2 w-[calc(100%-200px)] h-0.5 bg-red-800/80 hidden md:block -z-10"></div>

          <div className="grid md:grid-cols-4 gap-y-12 md:gap-y-0 gap-x-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-b from-[#B91C1C] to-[#7F1D1D] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
                  {step.number}
                </div>
                <h3 className={`font-bold text-lg mb-2 ${step.isSpecial ? 'text-red-700' : 'text-neutral-800'}`}>
                  {step.title}
                </h3>
                <p className="text-neutral-500 text-sm max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-20">
          <a
            href="/services"
            className="inline-flex items-center justify-center bg-gradient-to-b from-[#B91C1C] to-[#991B1B] text-white font-semibold px-10 py-4 rounded-full shadow-lg transition-transform hover:scale-105"
          >
            Book Now
            <ChevronRight className="w-5 h-5 ml-1" />
          </a>
        </div>
        
      </div>
    </section>
  );
}