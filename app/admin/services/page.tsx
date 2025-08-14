"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { 
    fetchLocations, addLocation, updateLocation, deleteLocation,
    fetchCategories, addCategory, updateCategory, deleteCategory,
    fetchServices, addService, updateService, deleteService,
    fetchSubServices, addSubService, updateSubService, deleteSubService,
    clearCategories, clearServices, clearSubServices
} from "@/app/store/features/admin/adminServicesSlice";
import ManagementColumn from "./ManagementColumn";
import AddLocationModal from "./AddLocationModal";
import AddItemModal from "./AddItemModal";
import AddEditServiceModal from "./AddEditServiceModal";
import AddEditSubServiceModal from "./AddEditSubServiceModal";

type ModalType = 'location' | 'category' | 'service' | 'subservice';

export default function ServiceManagementPage() {
    const dispatch = useAppDispatch();
    const { locations, categories, services, subServices, status } = useAppSelector(state => state.adminServices);

    const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
    const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
    
    const [modal, setModal] = useState<{ type: ModalType; data?: any } | null>(null);
    
    useEffect(() => { dispatch(fetchLocations(null)); }, [dispatch]);

    const handleSelectLocation = (id: string) => {
        if(id === selectedLocationId) return;
        setSelectedLocationId(id);
        setSelectedCategoryId(undefined); setSelectedServiceId(undefined);
        dispatch(clearCategories()); dispatch(clearServices()); dispatch(clearSubServices());
        dispatch(fetchCategories({ locationId: id }));
    };

    const handleSelectCategory = (id: string) => {
        if(id === selectedCategoryId) return;
        setSelectedCategoryId(id);
        setSelectedServiceId(undefined);
        dispatch(clearServices()); dispatch(clearSubServices());
        dispatch(fetchServices({ categoryId: id }));
    };
    
    const handleSelectService = (id: string) => {
        if(id === selectedServiceId) return;
        setSelectedServiceId(id);
        dispatch(clearSubServices());
        dispatch(fetchSubServices({ serviceId: id }));
    };

    const handleSave = (data: any) => {
        if (!modal) return;
        const { type, data: modalData } = modal;
        const payload = { ...data, _id: modalData?._id };

        const thunks = {
            location: { add: addLocation, update: updateLocation },
            category: { add: addCategory, update: updateCategory },
            service: { add: addService, update: updateService },
            subservice: { add: addSubService, update: updateSubService },
        };
        
        const actionToDispatch = modalData?._id ? thunks[type].update : thunks[type].add;
        
        if (type === 'category' && selectedLocationId) payload.locationId = selectedLocationId;
        if (type === 'service' && selectedCategoryId) payload.category = selectedCategoryId;
        if (type === 'subservice' && selectedServiceId) payload.serviceId = selectedServiceId;

        dispatch(actionToDispatch(payload));
        setModal(null);
    };
    
    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Service Hierarchy Management</h1>
                <p className="mt-1 text-md text-gray-600">Select an item in a column to view its children in the next column.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 h-[calc(100vh-160px)]">
                <ManagementColumn title="Locations" items={locations} selectedId={selectedLocationId} onSelect={handleSelectLocation}
                    onAdd={() => setModal({ type: 'location' })} onEdit={(item) => setModal({ type: 'location', data: item })}
                    onDelete={(id) => dispatch(deleteLocation({ _id: id }))} isLoading={status === 'loading' && !locations.length} />
                
                <ManagementColumn title="Categories" items={categories} selectedId={selectedCategoryId} onSelect={handleSelectCategory}
                    onAdd={() => setModal({ type: 'category' })} onEdit={(item) => setModal({ type: 'category', data: item })}
                    onDelete={(id) => dispatch(deleteCategory({ _id: id }))} isLoading={status === 'loading' && !!selectedLocationId && !categories.length} addDisabled={!selectedLocationId} />

                <ManagementColumn title="Services" items={services} selectedId={selectedServiceId} onSelect={handleSelectService}
                    onAdd={() => setModal({ type: 'service' })} onEdit={(item) => setModal({ type: 'service', data: item })}
                    onDelete={(id) => dispatch(deleteService({ _id: id }))} isLoading={status === 'loading' && !!selectedCategoryId && !services.length} addDisabled={!selectedCategoryId} />

                <ManagementColumn title="Sub-Services" items={subServices} selectedId={undefined} onSelect={() => {}}
                    onAdd={() => setModal({ type: 'subservice' })} onEdit={(item) => setModal({ type: 'subservice', data: item })}
                    onDelete={(id) => dispatch(deleteSubService({ _id: id }))} isLoading={status === 'loading' && !!selectedServiceId && !subServices.length} addDisabled={!selectedServiceId} />
            </div>

            {modal?.type === 'location' && <AddLocationModal isOpen={true} onClose={() => setModal(null)}
                onSave={handleSave} initialData={modal?.data} />}

            {modal?.type === 'category' && <AddItemModal isOpen={true} onClose={() => setModal(null)}
                onSave={handleSave}
                title={modal?.data ? 'Edit Category' : 'Add New Category'} label="Category Name" initialData={modal?.data} />}
            
            {modal?.type === 'service' && <AddEditServiceModal isOpen={true} onClose={() => setModal(null)}
                onSave={handleSave}
                initialData={modal?.data} categories={categories} />}

            {modal?.type === 'subservice' && <AddEditSubServiceModal isOpen={true} onClose={() => setModal(null)}
                onSave={handleSave}
                initialData={modal?.data} />}
        </div>
    );
}