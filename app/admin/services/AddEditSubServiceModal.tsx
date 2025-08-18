"use client";

import { useState, useEffect, useRef, FormEvent } from 'react';
import Modal from "@/components/admin/Modal";
import { SubService } from '@/types';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import api from '@/lib/api';
import toast from 'react-hot-toast';

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
    const [imageUrl, setImageUrl] = useState('');
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-700";

    useEffect(() => {
        if (isOpen) {
            setImageFile(null);
            if (initialData) {
                setName(initialData.name || '');
                setDescription(initialData.description || '');
                setPrice(initialData.price || 0);
                setDuration(initialData.duration || 0);
                setImageUrl(initialData.imageUrl || '');
                setImagePreview(initialData.imageUrl || null);
            } else {
                setName(''); setDescription(''); setPrice(0); setDuration(0);
                setImageUrl(''); setImagePreview(null);
            }
        }
    }, [isOpen, initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        let finalImageUrl = imageUrl;

        if (imageFile) {
            try {
                const { data: signedUrlData } = await api.get(`/admin/sub-services/signed-url?fileName=${imageFile.name}&fileType=${imageFile.type}`);
                await axios.put(signedUrlData.uploadUrl, imageFile, { headers: { 'Content-Type': imageFile.type } });
                finalImageUrl = signedUrlData.fileUrl;
            } catch (err) {
                toast.error("Image upload failed.");
                setIsUploading(false);
                return;
            }
        }
        
        onSave({ _id: initialData?._id, name, description, price, duration, imageUrl: finalImageUrl });
        setIsUploading(false);
    };

    return (
        <Modal title={initialData ? "Edit Sub-Service" : "Add New Sub-Service"} isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div><label className={labelClass}>Sub-Service Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputClass} /></div>
                <div><label className={labelClass}>Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} className={inputClass} /></div>
                <div><label className={labelClass}>Price (₹)</label><input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required className={inputClass} /></div>
                <div><label className={labelClass}>Duration (minutes)</label><input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} required className={inputClass} /></div>
                
                <div>
                    <label className={labelClass}>Image</label>
                    {imagePreview ? (
                        <div className="relative w-48 h-32 mt-2">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                            <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }} className="absolute top-1 right-1 p-1 bg-white rounded-full"><X size={16} /></button>
                        </div>
                    ) : (
                        <div onClick={() => fileInputRef.current?.click()} className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer">
                            <div className="text-center"><UploadCloud className="mx-auto h-12 w-12 text-gray-400" /><p className="text-sm">Upload an image</p></div>
                        </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>

                <div className="flex justify-end pt-4 mt-2 border-t border-gray-200">
                    <button type="button" onClick={onClose} className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={isUploading} className="inline-flex justify-center items-center py-2 px-6 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300">
                        {isUploading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                        Save Sub-Service
                    </button>
                </div>
            </form>
        </Modal>
    );
}
