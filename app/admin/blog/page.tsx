"use client";

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { createBlogPost, updateBlogPost } from '@/app/store/features/admin/adminBlogSlice';
import { BlogPost } from '@/types';
import BlogTable from './BlogTable';
import AddEditPostModal from './AddEditPostModal';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogManagementPage() {
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postToEdit, setPostToEdit] = useState<BlogPost | null>(null);

    const handleOpenModal = (post: BlogPost | null = null) => {
        setPostToEdit(post);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPostToEdit(null);
    };

    const handleSavePost = async (data: Partial<BlogPost>) => {
        try {
            if (postToEdit) {
                await dispatch(updateBlogPost({ ...data, _id: postToEdit._id })).unwrap();
                toast.success('Post updated successfully!');
            } else {
                await dispatch(createBlogPost(data)).unwrap();
                toast.success('Post created successfully!');
            }
            handleCloseModal();
        } catch (error) {
            toast.error(`Failed to save post: ${error}`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Blog Management</h2>
                    <p className="mt-1 text-gray-500">Create, edit, and manage all your blog articles.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Post
                </button>
            </div>
            <BlogTable onEdit={handleOpenModal} />

            <AddEditPostModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSavePost}
                initialData={postToEdit}
            />
        </div>
    );
}