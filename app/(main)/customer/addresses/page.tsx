// --- START OF FILE app/(main)/customer/addresses/page.tsx ---

"use client";

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchMyAddresses, addMyAddress, updateMyAddress, deleteMyAddress } from '@/app/store/features/customer/addressSlice';
import type { AddressFormData } from '@/app/store/features/customer/addressSlice';
import { Plus, Home, Briefcase, Edit, Trash2, Loader2 } from 'lucide-react';
import AddressModal from '@/app/(main)/components/customer/addresses/AddressModal';
import { Address } from '@/types';

// AddressIcon component remains the same
const AddressIcon = ({ type }: { type: Address['type'] }) => {
    const icons = {
        Home: <Home className="w-6 h-6 text-red-600" />,
        Office: <Briefcase className="w-6 h-6 text-blue-600" />,
        Other: <Plus className="w-6 h-6 text-gray-600" />,
    };
    return <div className={`p-3 rounded-full ${type === 'Home' ? 'bg-red-100' : type === 'Office' ? 'bg-blue-100' : 'bg-gray-100'}`}>{icons[type]}</div>;
};

export default function ManageAddressesPage() {
    const dispatch = useAppDispatch();
    
    // Select state from Redux store
    const { addresses, status, error } = useAppSelector(state => state.customerAddresses);
    const { token } = useAppSelector(state => state.auth);

    // Local state for modal management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState<AddressFormData | null>(null);

    // Fetch addresses on component mount if they haven't been fetched yet
    useEffect(() => {
        if (token && status === 'idle') {
            dispatch(fetchMyAddresses());
        }
    }, [token, status, dispatch]);

    // Handler to save (add or update) an address by dispatching an action
    const handleSaveAddress = async (addressData: AddressFormData) => {
        if (addressData._id) {
            await dispatch(updateMyAddress(addressData));
        } else {
            await dispatch(addMyAddress(addressData));
        }
        setIsModalOpen(false); // Close modal after dispatching
    };

    // Handler to open the modal
    const handleOpenModal = (address: Address | null = null) => {
        setAddressToEdit(address);
        setIsModalOpen(true);
    };
    
    // Handler to delete an address by dispatching an action
    const handleDeleteAddress = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;
        dispatch(deleteMyAddress(id));
    };

    // Render content based on Redux status
    const renderContent = () => {
        if (status === 'loading' && addresses.length === 0) {
            return <div className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-red-500" /></div>;
        }
        if (status === 'failed' && addresses.length === 0) {
            return <div className="text-center py-10 text-red-500">{error}</div>;
        }
        if (addresses.length === 0) {
            return <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">You haven't added any addresses yet.</div>;
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map(address => (
                    <div key={address._id} className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4">
                        <AddressIcon type={address.type} />
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800">{address.type}</h3>
                            <p className="text-gray-600">{address.line1}</p>
                            <p className="text-gray-600">{address.line2}</p>
                            <p className="text-gray-600">{address.city}, {address.pincode}</p>
                        </div>
                        <div className="flex-shrink-0">
                             <button onClick={() => handleOpenModal(address)} className="p-2 text-gray-500 hover:text-blue-600"><Edit className="w-5 h-5" /></button>
                             <button onClick={() => handleDeleteAddress(address._id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Manage Addresses</h1>
                    <p className="text-gray-500 mt-1">Add, edit, or remove your saved addresses.</p>
                </div>
                <button 
                  onClick={() => handleOpenModal()} 
                  className="w-full sm:w-auto flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 disabled:bg-red-300"
                  disabled={status === 'loading'}
                >
                    {status === 'loading' ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <Plus className="w-5 h-5 mr-2" />}
                    Add New Address
                </button>
            </div>

            {renderContent()}

            <AddressModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAddress}
                addressToEdit={addressToEdit}
            />
        </div>
    );
}

// --- END OF FILE app/(main)/customer/addresses/page.tsx ---