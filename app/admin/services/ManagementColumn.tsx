import React from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';

interface Item { _id: string; name: string; }
interface ManagementColumnProps {
    title: string;
    items: Item[];
    selectedId?: string;
    onSelect: (id: string) => void;
    onAdd: () => void;
    onEdit: (item: Item) => void;
    onDelete: (id: string) => void;
    isLoading?: boolean;
    addDisabled?: boolean;
}

export default function ManagementColumn({ title, items, selectedId, onSelect, onAdd, onEdit, onDelete, isLoading, addDisabled = false }: ManagementColumnProps) {
    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            onDelete(id);
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
                <h3 className="font-bold text-xl text-gray-800">{title}</h3>
                <button onClick={onAdd} disabled={addDisabled} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-full disabled:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-red-500">
                    <Plus className="w-5 h-5" />
                </button>
            </div>
            {isLoading ? (
                <div className="flex-grow flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                </div>
            ) : (
                <div className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-1.5">
                    {items.map(item => (
                        <div key={item._id} onClick={() => onSelect(item._id)}
                            className={`group p-3 rounded-lg cursor-pointer flex justify-between items-center transition-all duration-150 ${
                                selectedId === item._id ? 'bg-red-100 text-red-800 font-semibold shadow-sm ring-1 ring-red-200' : 'hover:bg-gray-100 hover:text-gray-800'
                            }`}
                        >
                            <span className="truncate pr-2">{item.name}</span>
                            <div className={`flex items-center space-x-1 transition-opacity ${selectedId === item._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full"><Edit className="w-4 h-4"/></button>
                                <button onClick={(e) => handleDelete(e, item._id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-full"><Trash2 className="w-4 h-4"/></button>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && <p className="text-sm text-gray-500 text-center pt-10">No {title.toLowerCase()} found.</p>}
                </div>
            )}
        </div>
    );
}