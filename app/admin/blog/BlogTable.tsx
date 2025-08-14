"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchAdminBlogPosts, deleteBlogPost } from '@/app/store/features/admin/adminBlogSlice';
import { BlogPost } from '@/types';
import { Edit, Trash2, Loader2, ShieldCheck, ShieldOff } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function BlogTable({ onEdit }: { onEdit: (post: BlogPost) => void }) {
    const dispatch = useAppDispatch();
    const { posts, status } = useAppSelector(state => state.adminBlog);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAdminBlogPosts());
        }
    }, [status, dispatch]);

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            dispatch(deleteBlogPost(id));
            toast.success("Post deleted.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3">Author</th>
                            <th scope="col" className="px-6 py-3">Featured</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {status === 'loading' && (
                            <tr><td colSpan={6} className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-red-500"/></td></tr>
                        )}
                        {status === 'succeeded' && posts.map(post => (
                            <tr key={post._id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                                <td className="px-6 py-4">{post.category}</td>
                                <td className="px-6 py-4">{post.author}</td>
                                <td className="px-6 py-4">
                                    {post.featured ? <ShieldCheck className="w-5 h-5 text-green-500" /> : <ShieldOff className="w-5 h-5 text-gray-400" />}
                                </td>
                                <td className="px-6 py-4">{format(new Date(post.createdAt), 'PP')}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button onClick={() => onEdit(post)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><Edit className="w-4 h-4"/></button>
                                    <button onClick={() => handleDelete(post._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><Trash2 className="w-4 h-4"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}