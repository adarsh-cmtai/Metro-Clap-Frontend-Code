"use client"

import React from 'react';
import Image from 'next/image';
import { Phone, MapPin, Clock, Headset, Star, Percent } from 'lucide-react';

const contactInfo = [
  {
    icon: Phone,
    title: "Call Us",
    text: "Available 24/7 for emergencies",
    bgColor: "bg-green-100/60",
    iconColor: "text-green-600"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    text: "------------------------",
    bgColor: "bg-purple-100/60",
    iconColor: "text-purple-600"
  },
  {
    icon: Clock,
    title: "Working Hours",
    text: "Mon - Sun: 6:00 AM - 10:00 PM",
    bgColor: "bg-pink-100/60",
    iconColor: "text-pink-600"
  },
  {
    icon: Headset,
    title: "Customer Support",
    text: "support@metroclap.com",
    subtext: "Quick response guaranteed",
    bgColor: "bg-orange-100/60",
    iconColor: "text-orange-600"
  },
];

const PromotionalBanner = () => (
  <section className="py-12 sm:py-16">
    <div className="bg-[#DC2626] rounded-2xl overflow-hidden">
      <div className="relative grid lg:grid-cols-2 items-center gap-8 lg:gap-16 p-8 md:p-12 lg:p-16 text-white">
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-700/50 rounded-full filter blur-3xl -translate-x-1/4 -translate-y-1/4"></div>
        <div className="relative">
          <div className="inline-block border border-white/30 text-white px-4 py-1.5 rounded-full text-sm">Limited offer</div>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
            Get <span className="text-yellow-400">50% OFF</span> on Your First Cleaning Service!
          </h2>
          <p className="mt-4 text-white/80 max-w-md">
            New customers save big! Book any cleaning service and get half off your first appointment. Professional quality, unbeatable price.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <a href="/claim-offer" className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-6 py-3 rounded-lg transition hover:bg-gray-200">
              <Percent className="w-4 h-4" /> Claim Offer Now
            </a>
            <a href="/services" className="border border-white/30 text-white font-medium px-6 py-3 rounded-lg transition hover:bg-white/10">Learn More</a>
          </div>
          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/20">
            <div>
              <p className="text-2xl font-bold text-yellow-400">24H</p>
              <p className="text-sm text-white/70">Valid Until</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">500+</p>
              <p className="text-sm text-white/70">Already Claimed</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-2xl font-bold text-yellow-400">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" /> 4.9
              </p>
              <p className="text-sm text-white/70">Customer Rating</p>
            </div>
          </div>
        </div>
        <div className="relative h-96 hidden lg:block">
          <div className="w-full h-full bg-white/10 rounded-lg p-2"></div>
          <div className="absolute -top-4 -right-4 w-28 h-28 bg-yellow-400 rounded-full flex flex-col items-center justify-center text-black shadow-lg">
            <p className="font-bold text-2xl">50%</p>
            <p className="text-sm font-semibold tracking-wider">OFF</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default function ContactPage() {
  return (
    <main className="relative bg-white py-8 sm:py-8 overflow-hidden">
      <div className="absolute top-20 right-20 w-32 h-32 bg-blue-100 rounded-full filter blur-2xl opacity-60 -z-10"></div>
      <div className="absolute bottom-1/3 right-10 w-32 h-32 bg-green-100 rounded-full filter blur-2xl opacity-60 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block border border-red-200 text-red-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Get In Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-800">
            Contact <span className="text-red-600">Us</span>
          </h1>
          <p className="mt-4 text-neutral-500 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to us through any of these channels.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((item, index) => (
                <div key={index} className={`p-6 rounded-2xl ${item.bgColor}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-white`}>
                    <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-lg text-neutral-800">{item.title}</h3>
                  <p className="text-sm text-neutral-600 mt-1">{item.text}</p>
                  {item.subtext && <p className="text-xs text-neutral-500 mt-1">{item.subtext}</p>}
                </div>
              ))}
            </div>
            <a href="tel:1234567890" className="mt-8 w-full bg-red-600 text-white font-semibold flex items-center justify-center gap-3 py-4 rounded-lg shadow-md hover:bg-red-700 transition-colors">
              <Phone className="w-5 h-5" />
              Call Now for Instant Booking
            </a>
          </div>

          <div className="border border-red-500 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-red-600 mb-6">Send us a Message</h3>
            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">First Name</label>
                  <input type="text" className="w-full bg-gray-100 border-none rounded-md px-4 py-2.5 focus:ring-2 focus:ring-red-400"/>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Last Name</label>
                  <input type="text" className="w-full bg-gray-100 border-none rounded-md px-4 py-2.5 focus:ring-2 focus:ring-red-400"/>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <input type="email" className="w-full bg-gray-100 border-none rounded-md px-4 py-2.5 focus:ring-2 focus:ring-red-400"/>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                <input type="tel" className="w-full bg-gray-100 border-none rounded-md px-4 py-2.5 focus:ring-2 focus:ring-red-400"/>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Message</label>
                <textarea rows={4} className="w-full bg-gray-100 border-none rounded-md px-4 py-2.5 focus:ring-2 focus:ring-red-400"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-red-700 transition-colors">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-24">
          <PromotionalBanner />
        </div>
      </div>
    </main>
  );
}