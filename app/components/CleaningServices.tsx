"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronRight, Loader2 } from 'lucide-react';
import { Service, CategoryWithServices } from '@/types';
import api from '@/lib/api';
import ServiceDetailModal from './ServiceDetailModal';

export default function CategorizedServices() {
  const [categories, setCategories] = useState<CategoryWithServices[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchCategorizedServices = async () => {
      try {
        const { data } = await api.get('/services/by-category');
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categorized services", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategorizedServices();
  }, []);

  const handleOpenModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const highlightWords: { [key: string]: string } = {
      "Residential Cleaning": "Cleaning",
      "Corporate Cleaning": "Cleaning",
      "Industrial Cleaning": "Cleaning",
      "Sofa Cleaning": "Cleaning",
  };

  return (
    <>
      <ServiceDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />
      <section className="relative bg-white py-8 sm:py-8 overflow-hidden">
        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-100 rounded-full filter blur-xl opacity-60 -z-10"></div>
        <div className="absolute top-1/4 right-10 w-20 h-20 bg-pink-100 rounded-full filter blur-xl opacity-60 -z-10"></div>
        <div className="absolute top-1/2 left-20 w-32 h-32 bg-green-100 rounded-full filter blur-2xl opacity-50 -z-10"></div>
        <div className="absolute top-3/4 right-20 w-28 h-28 bg-red-100 rounded-full filter blur-2xl opacity-50 -z-10"></div>
        <div className="absolute bottom-10 left-1/2 w-24 h-24 bg-yellow-100 rounded-full filter blur-xl opacity-60 -z-10"></div>

        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-2xl font-bold text-neutral-800 tracking-wider">
              HIGH QUALITY CLEANING <span className="text-red-500">SERVICES</span>
            </h1>
            <p className="mt-2 text-red-500 font-semibold tracking-wider">
              @ AFFORDABLE PRICES
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-10 h-10 animate-spin text-red-500" />
            </div>
          ) : (
            categories.map((category) => (
              <div key={category._id} className="mb-16">
                <h2 className="text-3xl font-bold mb-8">
                  <span className="text-red-500">{category.name.split(' ')[0]}</span>
                  <span className="text-neutral-800 ml-2">
                    {category.name.substring(category.name.indexOf(' ') + 1)}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.services.map((service) => (
                    <div key={service._id} className="rounded-2xl border border-gray-200/90 p-3 text-center shadow-sm bg-gray-50 flex flex-col">
                      <div className="relative w-full h-36 rounded-lg overflow-hidden mb-3">
                        <Image src={service.imageUrl || '/placeholder.png'} alt={service.name} fill className="object-cover" loading='lazy'/>
                      </div>
                      <h3 className="font-bold text-neutral-700 text-sm h-10 flex items-center justify-center flex-grow">
                        {service.name}
                      </h3>
                      <button 
                        onClick={() => handleOpenModal(service)}
                        className="inline-flex items-center justify-center text-white font-semibold px-4 py-2 rounded-lg text-xs mt-2 transition-transform hover:scale-105 bg-red-500"
                      >
                        Book Now
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  )
}