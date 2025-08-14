"use client";

import { useState, useEffect, FormEvent, useRef } from 'react';
import Modal from "@/components/admin/Modal";
import { Service, Category } from '@/types';
import { Plus, Trash2, UploadCloud, Loader2, X } from 'lucide-react';
import axios from 'axios';
import { useAppSelector } from '@/app/store/hooks';
import toast from 'react-hot-toast';

interface AddEditServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Service>) => void;
    initialData?: Service | null;
    categories: Category[];
}

export default function AddEditServiceModal({ isOpen, onClose, onSave, initialData, categories }: AddEditServiceModalProps) {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [tagline, setTagline] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [duration, setDuration] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [inclusions, setInclusions] = useState<string[]>(['']);
    const [exclusions, setExclusions] = useState<string[]>(['']);
    const [faqs, setFaqs] = useState<{ question: string; answer: string; }[]>([{ question: '', answer: '' }]);
    const [howItWorks, setHowItWorks] = useState<{ title: string; description: string; }[]>([{ title: '', description: '' }]);
    const [category, setCategory] = useState('');
    const [activeTab, setActiveTab] = useState('general');
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { token } = useAppSelector(state => state.auth);

    const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-700";

    useEffect(() => {
        if (isOpen) {
            setActiveTab('general');
            setImageFile(null);
            if (initialData) {
                setName(initialData.name || '');
                setSlug(initialData.slug || '');
                setTagline(initialData.tagline || '');
                setDescription(initialData.description || '');
                setPrice(initialData.price || 0);
                setDuration(initialData.duration || '');
                setImageUrl(initialData.imageUrl || '');
                setImagePreview(initialData.imageUrl || null);
                setInclusions(initialData.inclusions?.length ? initialData.inclusions : ['']);
                setExclusions(initialData.exclusions?.length ? initialData.exclusions : ['']);
                setFaqs(initialData.faqs?.length ? initialData.faqs : [{ question: '', answer: '' }]);
                setHowItWorks(initialData.howItWorks?.length ? initialData.howItWorks : [{ title: '', description: '' }]);
                setCategory(initialData.category?._id || '');
            } else {
                setName(''); setSlug(''); setTagline(''); setDescription(''); setPrice(0); setDuration('');
                setImageUrl(''); setImagePreview(null); setInclusions(['']); setExclusions(['']); setFaqs([{ question: '', answer: '' }]);
                setHowItWorks([{ title: '', description: '' }]); setCategory('');
            }
        }
    }, [isOpen, initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size must be less than 2MB.");
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const handleClearImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setImageUrl('');
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDynamicListChange = (list: any[], setList: Function, index: number, field: string, value: string) => {
        const newList = [...list];
        newList[index][field] = value;
        setList(newList);
    };

    const handleSimpleListChange = (list: string[], setList: Function, index: number, value: string) => {
        const newList = [...list];
        newList[index] = value;
        setList(newList);
    };

    const addListItem = (list: any[], setList: Function, newItem: any) => setList([...list, newItem]);
    const removeListItem = (list: any[], setList: Function, index: number) => setList(list.filter((_, i) => i !== index));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        let finalImageUrl = imageUrl;

        if (imageFile) {
            try {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data: signedUrlData } = await axios.get(
                    `${backendUrl}/api/admin/services/signed-url?fileName=${imageFile.name}&fileType=${imageFile.type}`, config
                );
                await axios.put(signedUrlData.uploadUrl, imageFile, {
                    headers: { 'Content-Type': imageFile.type }
                });
                finalImageUrl = signedUrlData.fileUrl;
            } catch (err) {
                toast.error("Image upload failed. Please try again.");
                setIsUploading(false);
                return;
            }
        }

        onSave({
            _id: initialData?._id, name, slug, tagline, description, price,
            duration, imageUrl: finalImageUrl, category: category as any,
            inclusions: inclusions.filter(Boolean),
            exclusions: exclusions.filter(Boolean),
            faqs: faqs.filter(f => f.question && f.answer),
            howItWorks: howItWorks.filter(h => h.title && h.description),
        });
        setIsUploading(false);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'details':
                return (
                    <div className="space-y-6">
                        <fieldset className="border border-gray-200 p-4 rounded-lg">
                            <legend className="px-2 font-semibold text-gray-700">Inclusions</legend>
                            <div className="space-y-3">
                                {inclusions.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input type="text" value={item} onChange={e => handleSimpleListChange(inclusions, setInclusions, index, e.target.value)} className={inputClass} placeholder="e.g., Pre-service inspection" />
                                        {inclusions.length > 1 && <button type="button" onClick={() => removeListItem(inclusions, setInclusions, index)} className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>}
                                    </div>
                                ))}
                                <button type="button" onClick={() => addListItem(inclusions, setInclusions, '')} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800"><Plus className="w-4 h-4 mr-1" />Add Inclusion</button>
                            </div>
                        </fieldset>
                        <fieldset className="border border-gray-200 p-4 rounded-lg">
                            <legend className="px-2 font-semibold text-gray-700">Exclusions</legend>
                            <div className="space-y-3">
                                {exclusions.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input type="text" value={item} onChange={e => handleSimpleListChange(exclusions, setExclusions, index, e.target.value)} className={inputClass} placeholder="e.g., Spare parts cost" />
                                        {exclusions.length > 1 && <button type="button" onClick={() => removeListItem(exclusions, setExclusions, index)} className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>}
                                    </div>
                                ))}
                                <button type="button" onClick={() => addListItem(exclusions, setExclusions, '')} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800"><Plus className="w-4 h-4 mr-1" />Add Exclusion</button>
                            </div>
                        </fieldset>
                    </div>
                );
            case 'how_it_works':
                 return (
                    <fieldset className="border border-gray-200 p-4 rounded-lg">
                        <legend className="px-2 font-semibold text-gray-700">How It Works</legend>
                        <div className="space-y-4">
                            {howItWorks.map((item, index) => (
                                <div key={index} className="space-y-2 p-3 border rounded-md bg-gray-50/50 relative">
                                    <input type="text" value={item.title} onChange={e => handleDynamicListChange(howItWorks, setHowItWorks, index, 'title', e.target.value)} placeholder="Step Title" className={inputClass} />
                                    <textarea value={item.description} onChange={e => handleDynamicListChange(howItWorks, setHowItWorks, index, 'description', e.target.value)} placeholder="Step Description" rows={2} className={inputClass} />
                                    {howItWorks.length > 1 && <button type="button" onClick={() => removeListItem(howItWorks, setHowItWorks, index)} className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>}
                                </div>
                            ))}
                            <button type="button" onClick={() => addListItem(howItWorks, setHowItWorks, { title: '', description: '' })} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800"><Plus className="w-4 h-4 mr-1" />Add Step</button>
                        </div>
                    </fieldset>
                );
            case 'faqs':
                return (
                    <fieldset className="border border-gray-200 p-4 rounded-lg">
                        <legend className="px-2 font-semibold text-gray-700">Frequently Asked Questions</legend>
                        <div className="space-y-4">
                            {faqs.map((item, index) => (
                                <div key={index} className="space-y-2 p-3 border rounded-md bg-gray-50/50 relative">
                                    <input type="text" value={item.question} onChange={e => handleDynamicListChange(faqs, setFaqs, index, 'question', e.target.value)} placeholder="Question" className={inputClass} />
                                    <textarea value={item.answer} onChange={e => handleDynamicListChange(faqs, setFaqs, index, 'answer', e.target.value)} placeholder="Answer" rows={3} className={inputClass} />
                                    {faqs.length > 1 && <button type="button" onClick={() => removeListItem(faqs, setFaqs, index)} className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>}
                                </div>
                            ))}
                            <button type="button" onClick={() => addListItem(faqs, setFaqs, { question: '', answer: '' })} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800"><Plus className="w-4 h-4 mr-1" />Add FAQ</button>
                        </div>
                    </fieldset>
                );
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="md:col-span-2"><label className={labelClass}>Service Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputClass} /></div>
                        <div className="md:col-span-2"><label className={labelClass}>Slug</label><input type="text" value={slug} onChange={e => setSlug(e.target.value)} required className={inputClass} /></div>
                        <div className="md:col-span-2"><label className={labelClass}>Tagline</label><input type="text" value={tagline} onChange={e => setTagline(e.target.value)} className={inputClass} /></div>
                        <div className="md:col-span-2"><label className={labelClass}>Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4} className={inputClass} /></div>
                        <div><label className={labelClass}>Base Price (₹)</label><input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required className={inputClass} /></div>
                        <div><label className={labelClass}>Duration</label><input type="text" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g., 2-3 hours" className={inputClass} /></div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Service Image</label>
                            <div className="mt-1">
                                {imagePreview ? (
                                    <div className="relative group w-48 h-32">
                                        <img src={imagePreview} alt="Preview" className="w-48 h-32 object-cover rounded-lg"/>
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <button type="button" onClick={handleClearImage} className="p-2 bg-white/80 rounded-full text-red-600"><X size={18}/></button>
                                        </div>
                                    </div>
                                ) : (
                                    <div onClick={() => fileInputRef.current?.click()} className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-red-400">
                                        <div className="space-y-1 text-center">
                                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400"/>
                                            <p className="text-sm text-gray-600">Click to upload image</p>
                                            <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                                        </div>
                                    </div>
                                )}
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
                            </div>
                        </div>
                        <div className="md:col-span-2"><label className={labelClass}>Category</label><select value={category} onChange={e => setCategory(e.target.value)} required className={inputClass}>
                            <option value="">Select Category</option>
                            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                        </select></div>
                    </div>
                );
        }
    };

    const TabButton = ({ id, label }: { id: string, label: string }) => (
        <button type="button" onClick={() => setActiveTab(id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ease-in-out ${activeTab === id ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
            {label}
        </button>
    );

    return (
        <Modal title={initialData ? "Edit Service" : "Add New Service"} isOpen={isOpen} onClose={onClose} size="4xl">
            <form onSubmit={handleSubmit}>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        <TabButton id="general" label="General" />
                        <TabButton id="details" label="Inclusions & Exclusions" />
                        <TabButton id="how_it_works" label="How It Works" />
                        <TabButton id="faqs" label="FAQs" />
                    </nav>
                </div>

                <div className="py-6 max-h-[60vh] overflow-y-auto px-1">
                    {renderTabContent()}
                </div>

                <div className="flex justify-end pt-5 mt-4 border-t border-gray-200">
                    <button type="button" onClick={onClose} className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        Cancel
                    </button>
                    <button type="submit" disabled={isUploading} className="inline-flex justify-center items-center py-2 px-6 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300">
                        {isUploading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                        Save Service
                    </button>
                </div>
            </form>
        </Modal>
    );
}