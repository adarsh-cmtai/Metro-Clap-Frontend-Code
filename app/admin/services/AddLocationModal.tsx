"use client";

import { useState, useEffect } from 'react';
import Modal from "@/components/admin/Modal";
import { Location } from '@/types';

interface AddLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Location>) => void;
    initialData?: Location | null;
}

export default function AddLocationModal({ isOpen, onClose, onSave, initialData }: AddLocationModalProps) {
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');

    const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-700";

    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name || '');
            setCity(initialData.city || '');
            setState(initialData.state || '');
            setPincode(initialData.pincode || '');
        } else if (isOpen) {
            setName(''); setCity(''); setState(''); setPincode('');
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, city, state, pincode });
    };

    return (
        <Modal title={initialData ? "Edit Location" : "Add New Location"} isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div><label className={labelClass}>Location Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputClass} /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelClass}>City</label><input type="text" value={city} onChange={e => setCity(e.target.value)} required className={inputClass} /></div>
                    <div><label className={labelClass}>State</label><input type="text" value={state} onChange={e => setState(e.target.value)} required className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>Pincode</label><input type="text" value={pincode} onChange={e => setPincode(e.target.value)} required maxLength={6} className={inputClass} /></div>
                <div className="flex justify-end pt-4 mt-2 border-t border-gray-200">
                    <button type="button" onClick={onClose} className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Save Location</button>
                </div>
            </form>
        </Modal>
    );
}