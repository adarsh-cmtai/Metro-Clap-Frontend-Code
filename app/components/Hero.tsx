"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, Loader2, Sparkles, Home, Sofa, Bath, Bug, Layers } from "lucide-react"
import { Service, CategoryWithServices } from "@/types"
import api from "@/lib/api"
import ServicesModal from "./ServicesModal"
import SubServiceAddToCartModal from "./SubServiceAddToCartModal"

const categoryVisuals: { [key: string]: { icon: React.ElementType, bgColor: string } } = {
  "Cleaning": { icon: Home, bgColor: "bg-blue-50" },
  "Electrician, Plumber & Carpenter": { icon: Sparkles, bgColor: "bg-purple-50" },
  "Sofa Cleaning": { icon: Sofa, bgColor: "bg-pink-50" },
  "Pest Control": { icon: Bug, bgColor: "bg-rose-50" },
  "Industrial Cleaning Services": { icon: Layers, bgColor: "bg-green-50" },
  "Default": { icon: Sparkles, bgColor: "bg-gray-50" }
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [categories, setCategories] = useState<CategoryWithServices[]>([]);
  const [loading, setLoading] = useState(true);

  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithServices | null>(null);

  const [isSubServiceModalOpen, setIsSubServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/services/by-category");
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories and services", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleCategoryClick = (category: CategoryWithServices) => {
    setSelectedCategory(category);
    setIsServicesModalOpen(true);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setIsServicesModalOpen(false);
    setIsSubServiceModalOpen(true);
  };

  const handleCloseSubServiceModal = () => {
    setIsSubServiceModalOpen(false);
    setSelectedService(null);
  };

  return (
    <>
      <ServicesModal
        isOpen={isServicesModalOpen}
        onClose={() => setIsServicesModalOpen(false)}
        categoryName={selectedCategory?.name || ''}
        services={selectedCategory?.services || []}
        onServiceSelect={handleServiceSelect}
      />
      <SubServiceAddToCartModal
        isOpen={isSubServiceModalOpen}
        onClose={handleCloseSubServiceModal}
        service={selectedService}
      />
      <section
        ref={sectionRef}
        className="relative bg-white py-12 sm:py-16 overflow-hidden fade-in-up"
      >
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-20">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 leading-tight">
                Trusted Home Services Delivered at Your{" "}
                <span className="text-[#E51D2A] font-extrabold">Doorstep</span>
              </h1>
              <p className="mt-6 text-xl text-neutral-600">
                What are you looking for?
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mt-8 max-w-lg mx-auto lg:mx-0">
                {loading ? (
                  <div className="col-span-full flex justify-center items-center h-48">
                    <Loader2 className="w-10 h-10 animate-spin text-[#E51D2A]" />
                  </div>
                ) : (
                  categories.slice(0, 9).map((category) => {
                    const visuals = categoryVisuals[category.name] || categoryVisuals["Default"];
                    return (
                      <button
                        key={category._id}
                        onClick={() => handleCategoryClick(category)}
                        className={`group p-5 rounded-2xl border border-gray-200 shadow-sm text-center transition-all duration-300 hover:shadow-lg hover:border-red-300 hover:-translate-y-1.5 ${visuals.bgColor}`}
                      >
                        {/* <div className="relative h-16 w-16 mx-auto mb-4 flex items-center justify-center">
                          <visuals.icon className="w-8 h-8 text-neutral-600 group-hover:text-red-600 transition-colors" />
                        </div> */}
                        <p className="font-semibold text-gray-700 text-base transition-colors group-hover:text-[#E51D2A]">
                          {category.name}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>


              <div className="mt-10 flex justify-center lg:justify-start">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-[#E51D2A] text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Us Now
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="grid grid-flow-col-dense grid-rows-2 gap-4 h-[500px]">
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/Home/Hero1.jpg"
                    alt="Team cleaning an office"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/Home/Hero3.jpg"
                    alt="Steaming a sofa"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative row-span-2 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/Home/Hero2.jpg"
                    alt="Vacuuming a carpeted hallway"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
