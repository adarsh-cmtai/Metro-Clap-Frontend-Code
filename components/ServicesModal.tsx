"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { X, Search, LoaderCircle, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"
import type { CategoryWithServices } from "@/app/services/components/types"

interface ServicesModalProps {
  onClose: () => void;
}

export default function ServicesModal({ onClose }: ServicesModalProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithServices[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithServices | null>(null);

  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get<CategoryWithServices[]>('/services/by-category');
        setCategories(data);
      } catch (err) {
        setError("Failed to fetch services. Please try again later.");
        console.error("Failed to fetch services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllServices();
  }, []);

  const handleNavigate = (categoryId: string, serviceName: string) => {
    const params = new URLSearchParams();
    params.append('categoryId', categoryId);
    params.append('service', serviceName);
    router.push(`/services?${params.toString()}`);
    onClose();
  };
  
  const handleBack = () => {
    setSelectedCategory(null);
    setSearchTerm("");
  }

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServices = selectedCategory?.services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getHeaderTitle = () => {
    if (selectedCategory) {
      return selectedCategory.name;
    }
    return "Explore Our Services";
  }
  
  const getSearchPlaceholder = () => {
     if (selectedCategory) {
      return `Search in ${selectedCategory.name}...`;
    }
    return "Search for a category...";
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col
                   animate-in fade-in-0 zoom-in-95 duration-300"
      >
        <div className="flex items-center p-4 border-b">
          {selectedCategory && (
            <button
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors mr-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <h2 className="text-xl font-bold text-neutral-800 flex-grow">{getHeaderTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors ml-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              autoFocus
            />
          </div>
        </div>
        
        <div className="p-2 max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center p-8 text-neutral-600">
              <LoaderCircle className="w-8 h-8 animate-spin text-red-500 mb-4" />
              <span className="font-semibold">Loading...</span>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center p-8 text-red-600">
              <AlertTriangle className="w-8 h-8 mb-4" />
              <span className="font-semibold">{error}</span>
            </div>
          )}
          
          {!loading && !error && (
            <ul className="space-y-1 p-2">
              {!selectedCategory ? (
                <>
                  {filteredCategories.length > 0 ? filteredCategories.map(category => (
                    <li key={category._id}>
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className="w-full flex justify-between items-center p-3 text-left rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <span className="text-neutral-800 font-medium">{category.name}</span>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-transform group-hover:translate-x-1" />
                      </button>
                    </li>
                  )) : (
                     <div className="text-center p-8 text-neutral-500">No categories found.</div>
                  )}
                </>
              ) : (
                <>
                  {filteredServices.length > 0 ? filteredServices.map(service => (
                    <li key={service._id}>
                      <button
                        onClick={() => handleNavigate(selectedCategory._id, service.name)}
                        className="w-full text-left p-3 rounded-lg text-neutral-700 hover:bg-red-50 hover:text-black transition-colors"
                      >
                        {service.name}
                      </button>
                    </li>
                  )) : (
                    <div className="text-center p-8 text-neutral-500">No services found in this category.</div>
                  )}
                </>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}