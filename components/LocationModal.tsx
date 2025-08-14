"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { fetchLocations, setSelectedLocation } from "@/app/store/features/location/locationSlice"
import { X, MapPin, Search, LoaderCircle, AlertTriangle } from "lucide-react"
import type { Location } from "@/app/services/components/types"
import toast from "react-hot-toast"

interface LocationModalProps {
  onClose: () => void;
}

export default function LocationModal({ onClose }: LocationModalProps) {
  const dispatch = useAppDispatch();
  const { locations, status } = useAppSelector((state) => state.location);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLocations());
    }
  }, [status, dispatch]);

  const handleLocationSelect = (location: Location) => {
    dispatch(setSelectedLocation(location));
    toast.success(`Location set to ${location.name}`);
    onClose();
  };

  const filteredLocations = locations.filter(location =>
    location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.pincode.toString().includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col
                   animate-in fade-in-0 zoom-in-95 duration-300"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-neutral-800">Select Your Location</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by city or pincode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="p-2 max-h-[60vh] overflow-y-auto">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center p-8 text-neutral-600">
              <LoaderCircle className="w-8 h-8 animate-spin text-red-500 mb-4" />
              <span className="font-semibold">Loading Locations...</span>
            </div>
          )}
          
          {status === 'failed' && (
            <div className="flex flex-col items-center justify-center p-8 text-red-600">
              <AlertTriangle className="w-8 h-8 mb-4" />
              <span className="font-semibold">Failed to load locations.</span>
              <p className="text-sm text-center text-neutral-500 mt-1">Please try again later.</p>
            </div>
          )}
          
          {status === 'succeeded' && (
            <>
              {filteredLocations.length > 0 ? (
                <ul className="space-y-1 p-2">
                  {filteredLocations.map((location) => (
                    <li key={location._id}>
                      <button
                        onClick={() => handleLocationSelect(location)}
                        className="w-full flex items-center p-3 text-left rounded-lg hover:bg-red-50 transition-colors group"
                      >
                        <MapPin className="w-6 h-6 text-red-500 mr-4 flex-shrink-0" />
                        <div>
                          <span className="text-neutral-800 font-semibold">{location.city}</span>
                          <p className="text-sm text-neutral-500">{location.pincode}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center p-8 text-neutral-500">
                  No locations found for "{searchTerm}".
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}