"use client"

import {
  Home, Sparkles, Sofa, Bath, Bug, Layers, Armchair, Factory, Wind, Refrigerator, Bed, 
  CookingPot, Package, Gem, Briefcase, PaintRoller, ShieldCheck, Sun, Scissors
} from "lucide-react";
import React from "react";

const services = [
  { name: "Home Deep Cleaning", icon: Home, bgColor: "bg-blue-100/60", href: "/services" },
  { name: "Sofa Shampooing", icon: Sofa, bgColor: "bg-purple-100/60", href: "/services" },
  { name: "Bathroom Cleaning", icon: Bath, bgColor: "bg-cyan-100/60", href: "/services" },
  { name: "Pest Control", icon: Bug, bgColor: "bg-rose-100/60", href: "/services" },
  { name: "Carpet Shampooing", icon: Layers, bgColor: "bg-green-100/60", href: "/services" },
  { name: "Dining Table Chairs", icon: Armchair, bgColor: "bg-gray-100/80", href: "/services" },
  { name: "Chimney Cleaning", icon: Factory, bgColor: "bg-blue-100/60", href: "/services" },
  { name: "Window Cleaning", icon: Wind, bgColor: "bg-purple-100/60", href: "/services" },
  { name: "Fridge Deep Cleaning", icon: Refrigerator, bgColor: "bg-rose-100/60", href: "/services" },
  { name: "Mattress Cleaning", icon: Bed, bgColor: "bg-yellow-100/60", href: "/services" },
  { name: "Kitchen Cleaning", icon: CookingPot, bgColor: "bg-rose-100/60", href: "/services" },
  { name: "Combo Offer", icon: Package, bgColor: "bg-cyan-100/60", href: "/services" },
  { name: "Marble / Floor Polishing", icon: Gem, bgColor: "bg-rose-100/60", href: "/services" },
  { name: "Office Cleaning", icon: Briefcase, bgColor: "bg-gray-100/80", href: "/services" },
  { name: "Home Painting", icon: PaintRoller, bgColor: "bg-purple-100/60", href: "/services" },
  { name: "Disinfection Services", icon: ShieldCheck, bgColor: "bg-green-100/60", href: "/services" },
  { name: "Curtain Steam Cleaning", icon: Scissors, bgColor: "bg-purple-100/60", href: "/services" },
  { name: "Exterior Cleaning", icon: Sun, bgColor: "bg-yellow-100/60", href: "/services" },
];

export default function ServiceSelectionGrid() {
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
          {services.map((service, index) => (
            <a
              href={service.href}
              key={index}
              className={`rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${service.bgColor}`}
              role="button"
            >
              <div className="bg-white w-20 h-14 rounded-xl shadow-md flex items-center justify-center mb-4">
                {React.createElement(service.icon, { className: "w-7 h-7 text-neutral-500" })}
              </div>
              <p className="text-neutral-700 text-sm font-medium text-center">{service.name}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
