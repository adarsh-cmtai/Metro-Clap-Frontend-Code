"use client"

import React, { useState, useEffect } from 'react';
import { Home, Sofa, Bath, Wind, CheckCircle, Loader2 } from "lucide-react";
import { Service } from '@/types';
import api from '@/lib/api';
import ServiceDetailModal from './ServiceDetailModal';

const cardStyles = [
  { 
    icon: Home, 
    accentColor: "indigo",
  },
  { 
    icon: Sofa, 
    accentColor: "purple",
  },
  { 
    icon: Bath, 
    accentColor: "rose",
  },
  { 
    icon: Wind, 
    accentColor: "teal",
  },
];

const colorVariants = {
  indigo: {
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-600",
    buttonBg: "bg-indigo-500",
    buttonHoverBg: "hover:bg-indigo-600",
    border: "border-indigo-500",
  },
  purple: {
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
    buttonBg: "bg-purple-500",
    buttonHoverBg: "hover:bg-purple-600",
    border: "border-purple-500",
  },
  rose: {
    iconBg: "bg-rose-100",
    iconText: "text-rose-600",
    buttonBg: "bg-rose-500",
    buttonHoverBg: "hover:bg-rose-600",
    border: "border-rose-500",
  },
  teal: {
    iconBg: "bg-teal-100",
    iconText: "text-teal-600",
    buttonBg: "bg-teal-500",
    buttonHoverBg: "hover:bg-teal-600",
    border: "border-teal-500",
  },
};


export default function ServiceListings() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const { data } = await api.get('/services/featured');
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch featured services", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedServices();
  }, []);

  const handleOpenModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <>
      <ServiceDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />
      <section className="relative bg-white py-8 sm:py-8 overflow-hidden">
        <div className="absolute bottom-0 left-10 w-32 h-32 bg-green-200/50 rounded-full filter blur-xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 px-4">
            <div className="inline-block border border-red-200 text-red-500 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              Featured Services
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800">
              Popular Cleaning Services
            </h2>
            <p className="mt-4 text-neutral-500 max-w-xl mx-auto">
              Book our most requested services with special offers
            </p>
          </div>

          {loading ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="w-10 h-10 animate-spin text-red-500" />
            </div>
          ) : (
            <div className="flex gap-8 overflow-x-auto pb-8 px-4 sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {services.map((service, index) => {
                const styleInfo = cardStyles[index % cardStyles.length];
                const colors = colorVariants[styleInfo.accentColor as keyof typeof colorVariants];

                return (
                  <div 
                    key={service._id} 
                    className={`flex-shrink-0 w-80 md:w-96 bg-white border border-gray-200/80 rounded-3xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-t-4 ${colors.border}`}
                  >
                    <div className="flex flex-col h-full">
                      
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${colors.iconBg}`}>
                          {React.createElement(styleInfo.icon, { className: `w-6 h-6 ${colors.iconText}` })}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-neutral-800">{service.name}</h3>
                          <p className="text-neutral-500 text-sm">{service.tagline}</p>
                        </div>
                      </div>

                      <div className="my-8 pl-1 flex-grow">
                        <p className="font-semibold text-neutral-700">
                          <span className="font-bold text-neutral-800 text-3xl">₹{service.price}</span> starting
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                          {service.inclusions.slice(0, 3).map((feature, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-auto">
                        <button
                          onClick={() => handleOpenModal(service)}
                          className={`block w-full text-white text-center font-semibold py-3 rounded-lg transition-colors ${colors.buttonBg} ${colors.buttonHoverBg}`}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
