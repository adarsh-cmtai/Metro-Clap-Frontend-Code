// --- START OF FILE app/(main)/components/customer/addresses/AddressModal.tsx ---

"use client";

import { useState, useEffect } from 'react';
import { X, Home, Briefcase, Plus } from 'lucide-react';

// This local interface is updated to align with the backend model.
// _id is optional because a new address won't have it yet.
export interface AddressFormData {
  _id?: string;
  type: 'Home' | 'Office' | 'Other';
  line1: string;
  line2: string;
  city: string;
  pincode: string;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: AddressFormData) => void;
  addressToEdit: AddressFormData | null;
}

const emptyAddress: AddressFormData = { type: 'Home', line1: '', line2: '', city: '', pincode: '' };

export default function AddressModal({ isOpen, onClose, onSave, addressToEdit }: AddressModalProps) {
  const [address, setAddress] = useState<AddressFormData>(emptyAddress);

  useEffect(() => {
    // When the modal opens, set the state based on whether we are editing or adding.
    if (isOpen) {
      if (addressToEdit) {
        setAddress(addressToEdit);
      } else {
        setAddress(emptyAddress);
      }
    }
  }, [addressToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };
  
  const handleTypeChange = (type: 'Home' | 'Office' | 'Other') => {
    setAddress({ ...address, type });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(address);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"><X size={24} /></button>
        <h3 className="text-xl font-bold mb-6">{addressToEdit ? 'Edit Address' : 'Add New Address'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Address Type</label>
            <div className="mt-2 flex space-x-2">
              <button type="button" onClick={() => handleTypeChange('Home')} className={`flex items-center px-4 py-2 text-sm border rounded-full ${address.type === 'Home' ? 'bg-red-500 text-white border-red-500' : 'bg-white'}`}><Home className="w-4 h-4 mr-2"/>Home</button>
              <button type="button" onClick={() => handleTypeChange('Office')} className={`flex items-center px-4 py-2 text-sm border rounded-full ${address.type === 'Office' ? 'bg-red-500 text-white border-red-500' : 'bg-white'}`}><Briefcase className="w-4 h-4 mr-2"/>Office</button>
              <button type="button" onClick={() => handleTypeChange('Other')} className={`flex items-center px-4 py-2 text-sm border rounded-full ${address.type === 'Other' ? 'bg-red-500 text-white border-red-500' : 'bg-white'}`}><Plus className="w-4 h-4 mr-2"/>Other</button>
            </div>
          </div>
          <div>
            <label htmlFor="line1" className="block text-sm font-medium text-gray-700">Flat, House no., Building</label>
            <input type="text" name="line1" id="line1" value={address.line1} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md"/>
          </div>
           <div>
            <label htmlFor="line2" className="block text-sm font-medium text-gray-700">Area, Street, Sector, Village</label>
            <input type="text" name="line2" id="line2" value={address.line2} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">Town/City</label>
              <input type="text" name="city" id="city" value={address.city} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md"/>
            </div>
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
              <input type="text" name="pincode" id="pincode" value={address.pincode} onChange={handleChange} required maxLength={6} className="mt-1 w-full p-2 border rounded-md"/>
            </div>
          </div>
          <div className="text-right pt-4">
            <button type="submit" className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600">
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- END OF FILE app/(main)/components/customer/addresses/AddressModal.tsx ---