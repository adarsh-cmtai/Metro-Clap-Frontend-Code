"use client";

import { useState, useEffect } from 'react';
import Modal from "@/components/admin/Modal";

interface Item { _id: string; name: string; }
interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string }) => void;
    title: string;
    label: string;
    initialData?: Item | null;
}

export default function AddItemModal({ isOpen, onClose, onSave, title, label, initialData }: AddItemModalProps) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name || '');
        } else if (isOpen) {
            setName('');
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name });
    };

    return (
        <Modal title={title} isOpen={isOpen} onClose={onClose} size="md">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button type="button" onClick={onClose} className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Save</button>
                </div>
            </form>
        </Modal>
    );
}