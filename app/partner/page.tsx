"use client";

import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { submitPartnerApplication } from "@/app/store/features/partnerApplicationSlice";
import { Trash2, Loader2, Shield, Search, X } from "lucide-react";
import { Service, Location } from "@/types";
import toast from "react-hot-toast";

const FormSection = ({ title, children, isRequired = true }: { title: string; children: React.ReactNode; isRequired?: boolean; }) => (
  <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
    <h3 className="text-lg font-bold mb-4 text-neutral-800">{title} {isRequired && <span className="text-red-500">*</span>}</h3>
    {children}
  </div>
);

const CustomFileInput = ({ label, id, isRequired, onChange }: { label: string; id: string; isRequired: boolean; onChange: (e: ChangeEvent<HTMLInputElement>) => void; }) => {
  const [fileName, setFileName] = useState('No file chosen');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName('No file chosen');
    }
    onChange(event);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-600 mb-1">{label} {isRequired && <span className="text-red-500">*</span>}</label>
      <div className="relative">
        <input type="file" id={id} required={isRequired} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden text-sm h-10">
          <span className="bg-gray-200 px-3 py-2 text-gray-700 border-r border-gray-300 h-full flex items-center">Choose File</span>
          <span className="px-3 py-2 text-gray-500 flex-grow whitespace-nowrap overflow-hidden text-ellipsis">{fileName}</span>
        </div>
      </div>
    </div>
  );
};

interface FormData {
  services: string[]; city: string; companyName: string; aadhaarNo: string; gstNo: string;
  contacts: { name: string; mobile: string; email: string; }[];
  addresses: { pin: string; street: string; house: string; apartment: string; landmark: string, district: string; state: string; }[];
  servicePincodes: string[];
}

export default function PartnerPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status: appStatus, error } = useAppSelector(state => state.partnerApplication);
  const { user } = useAppSelector(state => state.auth);
  
  const [formData, setFormData] = useState<FormData>({
    services: [], city: '', companyName: '', aadhaarNo: '', gstNo: '',
    contacts: [{ name: '', mobile: '', email: '' }],
    addresses: [{ pin: '', street: '', house: '', apartment: '', landmark: '', district: '', state: '' }],
    servicePincodes: ['']
  });
  const [files, setFiles] = useState<{ [key: string]: File | null }>({ photo: null, aadhaarFront: null, aadhaarBack: null, gstCertificate: null });
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user && user.mobileNumber && formData.contacts[0].mobile === '') {
        setFormData(prev => ({
            ...prev,
            contacts: [{ ...prev.contacts[0], mobile: user.mobileNumber, name: user.name }]
        }));
    }
  }, [user]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      try {
        const [servicesRes, locationsRes] = await Promise.all([
          axios.get(`${backendUrl}/api/services`),
          axios.get(`${backendUrl}/api/admin/locations`)
        ]);
        setAllServices(servicesRes.data);
        setLocations(locationsRes.data);
      } catch (err) { console.error("Failed to fetch initial data", err); }
    };
    fetchInitialData();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDynamicListChange = (index: number, e: ChangeEvent<HTMLInputElement>, field: 'contacts' | 'addresses' | 'servicePincodes') => {
    const { name, value } = e.target;
    const list = [...formData[field]];
    if (typeof list[index] === 'object') {
      (list[index] as any)[name] = value;
    } else {
      list[index] = value;
    }
    setFormData(prev => ({ ...prev, [field]: list }));
  };

  const addDynamicItem = (field: 'contacts' | 'addresses' | 'servicePincodes') => {
    const newItem = field === 'contacts' ? { name: '', mobile: '', email: '' } : field === 'addresses' ? { pin: '', street: '', house: '', apartment: '', landmark: '', district: '', state: '' } : '';
    setFormData(prev => ({ ...prev, [field]: [...prev[field], newItem] }));
  };

  const removeDynamicItem = (index: number, field: 'contacts' | 'addresses' | 'servicePincodes') => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleServiceToggle = (serviceName: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceName) ? prev.services.filter(s => s !== serviceName) : [...prev.services, serviceName]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [key]: file }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
        toast.error("You must be logged in to submit an application.");
        router.push('/partner/signup');
        return;
    }
    if (user.role !== 'partner') {
        toast.error("Only users with a partner account can submit an application. Please sign up as a partner.");
        router.push('/partner/signup');
        return;
    }

    const uploadFile = async (key: string, file: File) => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await axios.get(`${backendUrl}/api/partner-applications/signed-url`, { params: { fileName: file.name, fileType: file.type } });
      const { uploadUrl, fileUrl } = res.data;
      await axios.put(uploadUrl, file, { headers: { 'Content-Type': file.type } });
      return { key, url: fileUrl };
    };

    try {
      const uploadPromises = Object.entries(files)
        .filter(([_, file]) => file)
        .map(([key, file]) => uploadFile(key, file!));
      const uploadedFiles = await Promise.all(uploadPromises);

      const documentUrls = uploadedFiles.reduce((acc, { key, url }) => {
        acc[`${key}Url`] = url;
        return acc;
      }, {} as { [key: string]: string });

      const finalPayload = { ...formData, documents: documentUrls };
      const result = await dispatch(submitPartnerApplication(finalPayload));

      if (submitPartnerApplication.fulfilled.match(result)) {
        toast.success('Application submitted successfully!');
        router.push('/pro');
      } else {
        toast.error(`Submission failed: ${result.payload || 'An error occurred.'}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during file upload. Please try again.');
    }
  };

  const filteredServices = allServices.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>
      {/* <div className="h-1 bg-blue-500" /> */}
      <section id="hero-partner" className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="flex flex-col">
                    <button className="self-start border border-red-600 text-red-600 px-5 py-1.5 rounded-full text-sm font-medium hover:bg-red-600 hover:text-white transition-colors duration-300 mb-8">
                        Join Our Network
                    </button>

                    <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                        Become a <span className="text-red-600">MetroClap</span> Partner
                    </h1>

                    <p className="mt-6 text-gray-300 max-w-xl">
                        Join thousands of cleaning professionals who have built successful businesses with MetroClap. Get access to customers, flexible scheduling, and competitive earnings.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 mt-12">
                        <div className="flex gap-4 items-start">
                            <div className="bg-red-900/40 p-3 rounded-md mt-1 flex-shrink-0">
                                <Shield className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl">Earn More</h3>
                                <p className="text-sm text-gray-400 mt-1">Up to 50/hour with flexible scheduling</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                             <div className="bg-red-900/40 p-3 rounded-md mt-1 flex-shrink-0">
                                <Shield className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl">Steady Customers</h3>
                                <p className="text-sm text-gray-400 mt-1">Access to our growing customer base</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                             <div className="bg-red-900/40 p-3 rounded-md mt-1 flex-shrink-0">
                                <Shield className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl">Full Support</h3>
                                <p className="text-sm text-gray-400 mt-1">Training, insurance, and 24/7 support</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="bg-red-900/40 p-3 rounded-md mt-1 flex-shrink-0">
                                <Shield className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl">Be Your Boss</h3>
                                <p className="text-sm text-gray-400 mt-1">Work when you want, where you want</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-x-12 gap-y-6 mt-16">
                         <div>
                            <p className="text-3xl font-bold text-red-600">5000+</p>
                            <p className="text-sm text-gray-400 mt-1">Active Partners</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-red-600">2M+</p>
                            <p className="text-sm text-gray-400 mt-1">Earned Monthly</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-red-600">4.8★</p>
                            <p className="text-sm text-gray-400 mt-1">Partner Rating</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-center items-center">
                     <div className="p-1 border border-gray-700">
                        <img 
                            src="/BecomePartner.jpg" 
                            alt="Business partners shaking hands"
                            className="object-cover"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section id="form-partner" className="relative bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <FormSection title="Choose Your Services">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search for a service..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto p-2 space-y-1">
                    {filteredServices.length > 0 ? (
                      filteredServices.map(service => (
                        <label key={service._id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={() => handleServiceToggle(service.name)}
                            checked={formData.services.includes(service.name)}
                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-700">{service.name}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 p-2">No services found.</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-600 mb-4">Selected services</h4>
                  <div className="space-y-2">
                    {formData.services.length > 0 ? (
                      formData.services.map((serviceName, index) => (
                        <div key={index} className="flex items-center justify-between bg-red-50 text-red-800 p-2 rounded-md text-sm font-medium">
                          <span>{serviceName}</span>
                          <button
                            type="button"
                            onClick={() => handleServiceToggle(serviceName)}
                            className="text-red-500 hover:text-red-700"
                            aria-label={`Remove ${serviceName}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-200 rounded-md">
                        <p className="text-sm text-gray-400 p-4">No services selected</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </FormSection>

            <FormSection title="Select Your City">
              <select name="city" value={formData.city} onChange={handleInputChange} className="w-full text-sm p-2 border rounded-md">
                <option value="">Select a City</option>
                {locations.map(loc => <option key={loc._id} value={`${loc.city}, ${loc.state} - ${loc.pincode}`}>{`${loc.name} (${loc.city}, ${loc.state} - ${loc.pincode})`}</option>)}
              </select>
            </FormSection>

            <FormSection title="Vendor Information">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleInputChange} className="w-full text-sm p-2 border rounded-md" />
                <input type="text" name="aadhaarNo" placeholder="Aadhaar No" value={formData.aadhaarNo} onChange={handleInputChange} className="w-full text-sm p-2 border rounded-md" />
                <input type="text" name="gstNo" placeholder="GST Number" value={formData.gstNo} onChange={handleInputChange} className="w-full text-sm p-2 border rounded-md" />
              </div>
            </FormSection>

            <FormSection title="Contacts">
              {formData.contacts.map((contact, index) => (
                <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg mb-4 relative">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" name="name" placeholder="Contact Name" value={contact.name} onChange={(e) => handleDynamicListChange(index, e, 'contacts')} className="w-full text-sm p-2 border rounded-md" />
                    <input type="text" name="mobile" placeholder="Mobile" value={contact.mobile} onChange={(e) => handleDynamicListChange(index, e, 'contacts')} className="w-full text-sm p-2 border rounded-md" />
                    <input type="text" name="email" placeholder="Email" value={contact.email} onChange={(e) => handleDynamicListChange(index, e, 'contacts')} className="w-full text-sm p-2 border rounded-md" />
                  </div>
                  {formData.contacts.length > 1 && <button type="button" onClick={() => removeDynamicItem(index, 'contacts')} className="absolute top-3 right-3 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}
                </div>
              ))}
              <button type="button" onClick={() => addDynamicItem('contacts')} className="text-sm font-semibold text-red-600 hover:text-red-800 mt-2">+ Add Contact</button>
            </FormSection>

            <FormSection title="Address">
              {formData.addresses.map((address, index) => (
                <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg mb-4 relative">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6 md:col-span-4"><input type="text" name="pin" placeholder="Pin Code" value={address.pin} onChange={(e) => handleDynamicListChange(index, e, 'addresses')} className="w-full text-sm p-2 border rounded-md" /></div>
                    <div className="col-span-6 md:col-span-4"><input type="text" name="state" placeholder="State" value={address.state} onChange={(e) => handleDynamicListChange(index, e, 'addresses')} className="w-full text-sm p-2 border rounded-md" /></div>
                    <div className="col-span-12 md:col-span-4"><input type="text" name="district" placeholder="District" value={address.district} onChange={(e) => handleDynamicListChange(index, e, 'addresses')} className="w-full text-sm p-2 border rounded-md" /></div>
                    <div className="col-span-12"><input type="text" name="street" placeholder="Street/Location/Village" value={address.street} onChange={(e) => handleDynamicListChange(index, e, 'addresses')} className="w-full text-sm p-2 border rounded-md" /></div>
                    <div className="col-span-12 md:col-span-4"><input type="text" name="house" placeholder="House #" value={address.house} onChange={(e) => handleDynamicListChange(index, e, 'addresses')} className="w-full text-sm p-2 border rounded-md" /></div>
                    <div className="col-span-12 md:col-span-4"><input type="text" name="apartment" placeholder="Apartment/Building" value={address.apartment} onChange={(e) => handleDynamicListChange(index, e, 'addresses')} className="w-full text-sm p-2 border rounded-md" /></div>
                    <div className="col-span-12 md:col-span-4"><input type="text" name="landmark" placeholder="Landmark" value={address.landmark} onChange={(e) => handleDynamicListChange(index, e, 'addresses')} className="w-full text-sm p-2 border rounded-md" /></div>
                  </div>
                  {formData.addresses.length > 1 && <button type="button" onClick={() => removeDynamicItem(index, 'addresses')} className="absolute top-3 right-3 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}
                </div>
              ))}
              <button type="button" onClick={() => addDynamicItem('addresses')} className="text-sm font-semibold text-red-600 hover:text-red-800 mt-2">+ Add Address</button>
            </FormSection>

            <FormSection title="Pin codes you serve">
              {formData.servicePincodes.map((pincode, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  <input type="text" placeholder="Pincode" value={pincode} onChange={(e) => handleDynamicListChange(index, e, 'servicePincodes')} className="w-full text-sm p-2 border rounded-md" />
                  {formData.servicePincodes.length > 1 && <button type="button" onClick={() => removeDynamicItem(index, 'servicePincodes')} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}
                </div>
              ))}
              <button type="button" onClick={() => addDynamicItem('servicePincodes')} className="text-sm font-semibold text-red-600 hover:text-red-800 mt-2">+ Add Pincode</button>
            </FormSection>

            <FormSection title="Upload Documents">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <CustomFileInput label="PHOTO" id="photo" isRequired={true} onChange={(e) => handleFileChange(e, 'photo')} />
                <CustomFileInput label="AADHAR CARD FRONT" id="aadhaarFront" isRequired={true} onChange={(e) => handleFileChange(e, 'aadhaarFront')} />
                <CustomFileInput label="AADHAR CARD BACK" id="aadhaarBack" isRequired={true} onChange={(e) => handleFileChange(e, 'aadhaarBack')} />
                <CustomFileInput label="GST CERTIFICATE" id="gstCertificate" isRequired={false} onChange={(e) => handleFileChange(e, 'gstCertificate')} />
              </div>
            </FormSection>

            <div className="pt-6">
              <button type="submit" disabled={appStatus === 'loading'} className="w-full bg-red-600 text-white font-bold py-4 rounded-lg hover:bg-red-700 disabled:bg-red-300">
                {appStatus === 'loading' ? <Loader2 className="animate-spin mx-auto" /> : 'Submit Application'}
              </button>
              {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}