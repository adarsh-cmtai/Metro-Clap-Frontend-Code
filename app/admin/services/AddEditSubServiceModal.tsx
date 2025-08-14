"use client";

import { useState, useEffect } from 'react';
import Modal from "@/components/admin/Modal";
import { SubService } from '@/types';

interface AddEditSubServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<SubService>) => void;
    initialData?: SubService | null;
}

export default function AddEditSubServiceModal({ isOpen, onClose, onSave, initialData }: AddEditSubServiceModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [duration, setDuration] = useState(0);

    const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-700";

    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setPrice(initialData.price || 0);
            setDuration(initialData.duration || 0);
        } else if (isOpen) {
            setName(''); setDescription(''); setPrice(0); setDuration(0);
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ _id: initialData?._id, name, description, price, duration });
    };

    return (
        <Modal title={initialData ? "Edit Sub-Service" : "Add New Sub-Service"} isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div><label className={labelClass}>Sub-Service Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputClass} /></div>
                <div><label className={labelClass}>Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} className={inputClass} /></div>
                <div><label className={labelClass}>Price (₹)</label><input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required className={inputClass} /></div>
                <div><label className={labelClass}>Duration (minutes)</label><input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} required className={inputClass} /></div>
                <div className="flex justify-end pt-4 mt-2 border-t border-gray-200">
                    <button type="button" onClick={onClose} className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Save Sub-Service</button>
                </div>
            </form>
        </Modal>
    );
}