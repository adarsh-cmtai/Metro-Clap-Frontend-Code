"use client";

import { Service } from '@/types';
import { Edit, Plus } from "lucide-react";

const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <div onClick={onChange} className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer ${checked ? 'bg-red-500' : 'bg-gray-300'}`}>
        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-5' : ''}`}/>
    </div>
);

interface ServiceTableProps {
    services: Service[];
    onAdd: () => void;
    onEdit: (service: Service) => void;
    onToggle: (service: Service) => void;
}

export default function ServiceTable({ services, onAdd, onEdit, onToggle }: ServiceTableProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">All Services</h3>
        <button onClick={onAdd} className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600">
          <Plus className="w-5 h-5 mr-2" />Add Service
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Service Name</th>
              <th scope="col" className="px-6 py-3">Category</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
                <tr key={service._id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{service.name}</td>
                    <td className="px-6 py-4">{service.category.name}</td>
                    <td className="px-6 py-4">₹{service.price}</td>
                    <td className="px-6 py-4"><ToggleSwitch checked={service.isActive} onChange={() => onToggle(service)} /></td>
                    <td className="px-6 py-4 text-right">
                        <button onClick={() => onEdit(service)} className="p-2 text-gray-500 hover:text-red-600"><Edit className="w-5 h-5" /></button>
                    </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}