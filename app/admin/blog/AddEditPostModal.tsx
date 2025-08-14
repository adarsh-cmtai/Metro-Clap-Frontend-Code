"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import Modal from "@/components/admin/Modal";
import { BlogPost } from '@/types';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface AddEditPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<BlogPost>) => void;
    initialData: BlogPost | null;
}

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function AddEditPostModal({ isOpen, onClose, onSave, initialData }: AddEditPostModalProps) {
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [featured, setFeatured] = useState(false);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setTitle(initialData.title || '');
                setExcerpt(initialData.excerpt || '');
                setContent(initialData.content || '');
                setAuthor(initialData.author || '');
                setCategory(initialData.category || '');
                setImageUrl(initialData.imageUrl || '');
                setImagePreview(initialData.imageUrl || null);
                setFeatured(initialData.featured || false);
            } else {
                setTitle(''); setExcerpt(''); setContent(''); setAuthor('');
                setCategory(''); setImageUrl(''); setImagePreview(null);
                setFeatured(false);
            }
            setImageFile(null);
        }
    }, [isOpen, initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSavePost = async () => {
        setIsUploading(true);
        let finalImageUrl = imageUrl;

        if (imageFile) {
            try {
                const { data: signedUrlData } = await api.get(`/admin/blog/signed-url?fileName=${imageFile.name}&fileType=${imageFile.type}`);
                await axios.put(signedUrlData.uploadUrl, imageFile, { headers: { 'Content-Type': imageFile.type } });
                finalImageUrl = signedUrlData.fileUrl;
            } catch (err) {
                toast.error("Image upload failed.");
                setIsUploading(false);
                return;
            }
        }
        
        onSave({ title, excerpt, content, author, category, imageUrl: finalImageUrl, featured });
        setIsUploading(false);
    };

    return (
        <Modal title={initialData ? 'Edit Blog Post' : 'Create New Post'} isOpen={isOpen} onClose={onClose} size="3xl">
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <input type="text" placeholder="Post Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded-md" />
                <textarea placeholder="Excerpt" value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} className="w-full p-2 border rounded-md" />
                <div>
                    <label className="text-sm font-medium">Content</label>
                    {isClient && <ReactQuill theme="snow" value={content} onChange={setContent} className="bg-white" />}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} className="w-full p-2 border rounded-md" />
                    <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                    <label className="text-sm font-medium">Featured Image</label>
                    {imagePreview ? (
                        <div className="relative w-full h-48 mt-2">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                            <button onClick={() => { setImagePreview(null); setImageFile(null); }} className="absolute top-2 right-2 p-1 bg-white rounded-full"><X size={16} /></button>
                        </div>
                    ) : (
                        <div onClick={() => fileInputRef.current?.click()} className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer">
                            <div className="text-center"><UploadCloud className="mx-auto h-12 w-12 text-gray-400" /><p>Upload an image</p></div>
                        </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="featured" checked={featured} onChange={e => setFeatured(e.target.checked)} className="h-4 w-4" />
                    <label htmlFor="featured">Mark as Featured Post</label>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                    <button onClick={handleSavePost} disabled={isUploading} className="px-4 py-2 bg-red-500 text-white rounded-md disabled:bg-red-300 flex items-center">
                        {isUploading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                        Save Post
                    </button>
                </div>
            </div>
        </Modal>
    );
}