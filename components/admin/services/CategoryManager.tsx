"use client";

import { useState } from 'react';
import { Category } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

interface CategoryManagerProps {
    categories: Category[];
    onAdd: (name: string) => void;
    onDelete: (id: string) => void;
}

export default function CategoryManager({ categories, onAdd, onDelete }: CategoryManagerProps) {
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(newCategoryName);
        setNewCategoryName('');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Manage Categories</h3>
            <form onSubmit={handleSubmit} className="flex items-center gap-4 mb-6">
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter new category name"
                    className="flex-grow p-2 border border-gray-300 rounded-lg"
                />
                 <button type="submit" className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                    <Plus className="w-5 h-5 mr-2" />Add Category
                </button>
            </form>
            <div className="space-y-3">
                {categories.map(category => (
                    <div key={category._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                        <span className="font-medium text-gray-700">{category.name}</span>
                        <button onClick={() => onDelete(category._id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}