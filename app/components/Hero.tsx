"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, Loader2 } from "lucide-react"
import { Service } from "@/types"
import api from "@/lib/api"
import SubServiceSelectionModal from "./SubServiceSelectionModal"

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <>
      <SubServiceSelectionModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />
      <section ref={sectionRef} className="relative bg-white py-5 sm:py-5 overflow-hidden fade-in-up">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-16">
            
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 leading-tight">
                Trusted Home Services, Delivered at Your <span className="text-[#E51D2A] font-extrabold">Doorstep</span>
              </h1>
              <p className="mt-8 text-lg text-neutral-600">
                What are you looking for?
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                {loading ? (
                    <div className="col-span-full flex justify-center items-center h-48">
                        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                    </div>
                ) : (
                  services.slice(0, 8).map((service) => (
                    <button 
                      key={service._id} 
                      onClick={() => handleServiceClick(service)}
                      className="p-4 rounded-2xl border border-gray-200/70 shadow-sm text-center transition-transform hover:-translate-y-1 bg-gray-50"
                    >
                      <div className="relative h-14 w-14 mx-auto mb-3">
                        <Image src={service.imageUrl || "/placeholder.png"} alt={`${service.name} icon`} fill className="object-contain" loading="lazy" />
                      </div>
                      <p className="font-medium text-gray-600 text-sm h-10 flex items-center justify-center">{service.name}</p>
                    </button>
                  ))
                )}
              </div>

              <div className="mt-8 flex justify-center lg:justify-start">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-[#E51D2A] text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-red-700 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -top-8 -right-2 w-20 h-20 -z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
                  <circle opacity="0.19" cx="50" cy="50" r="50" fill="#E02229" fillOpacity="0.77"/>
                </svg>
              </div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 -z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
                  <circle opacity="0.11" cx="50" cy="50" r="50" fill="#5AEB00" fillOpacity="0.96"/>
                </svg>
              </div>
              <div className="absolute -bottom-8 right-12 w-20 h-20 -z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
                  <circle opacity="0.15" cx="50" cy="50" r="50" fill="#007BFF"/>
                </svg>
              </div>

              <div className="grid grid-flow-col-dense grid-rows-2 gap-4 h-[500px]">
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                    <Image src="/Home/Hero1.jpg" alt="Team cleaning an office" fill className="object-cover" />
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                    <Image src="/Home/Hero3.jpg" alt="Steaming a sofa" fill className="object-cover" />
                </div>
                <div className="relative row-span-2 rounded-2xl overflow-hidden shadow-lg">
                    <Image src="/Home/Hero2.jpg" alt="Vacuuming a carpeted hallway" fill className="object-cover" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}