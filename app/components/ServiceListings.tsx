"use client"

import React, { useState, useEffect } from 'react';
import { Home, Sofa, Bath, Wind, CheckCircle, Loader2 } from "lucide-react";
import { Service } from '@/types';
import api from '@/lib/api';
import ServiceDetailModal from './ServiceDetailModal';

const cardStyles = [
  { icon: Home, gradient: "from-indigo-500 to-blue-500" },
  { icon: Sofa, gradient: "from-purple-500 to-indigo-500" },
  { icon: Bath, gradient: "from-pink-500 to-rose-500" },
  { icon: Wind, gradient: "from-cyan-500 to-teal-500" },
];

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
                const style = cardStyles[index % cardStyles.length];
                return (
                  <div key={service._id} className={`flex-shrink-0 w-80 md:w-96 rounded-3xl p-8 text-white relative overflow-hidden bg-gradient-to-br shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${style.gradient}`}>
                    <div className="relative z-10 flex flex-col h-full">
                      
                      <div className="flex items-center gap-4">
                        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                          {React.createElement(style.icon, { className: "w-6 h-6 text-white" })}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl">{service.name}</h3>
                          <p className="text-white/80 text-sm">{service.tagline}</p>
                        </div>
                      </div>

                      <div className="my-8 pl-1 flex-grow">
                        <p className="font-semibold text-white/90">
                          <span className="font-bold text-white text-3xl">₹{service.price}</span> starting
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-white/90">
                          {service.inclusions.slice(0, 3).map((feature, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-white/70" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-auto">
                        <button
                          onClick={() => handleOpenModal(service)}
                          className="block w-full bg-white/20 text-center font-semibold py-3 rounded-lg backdrop-blur-sm transition-colors hover:bg-white/30"
                        >
                          Book Now
                        </button>
                      </div>

                    </div>
                    <div className="absolute w-48 h-48 bg-white/10 rounded-full -bottom-16 -right-16 z-0"></div>
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