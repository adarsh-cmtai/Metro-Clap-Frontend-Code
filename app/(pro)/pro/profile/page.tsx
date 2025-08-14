"use client";

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { updateProfile } from '@/app/store/features/auth/authSlice';
import { Camera, Save, Loader2, X, FileText, ExternalLink } from 'lucide-react';

export default function MyProfilePage() {
    const dispatch = useAppDispatch();
    const { user, status } = useAppSelector(state => state.auth);
    const token = useAppSelector(state => state.auth.token);
    
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [pincodes, setPincodes] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState('');
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (user) {
            setName(user.name || '');
            setBio(user.partnerProfile?.bio || '');
            setPincodes(user.partnerProfile?.serviceablePincodes?.join(', ') || '');
            setSkills(user.partnerProfile?.skills || []);
        }
    }, [user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImageFile(file);
            setLocalImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddSkill = () => {
        const trimmedInput = skillInput.trim();
        if (trimmedInput && !skills.includes(trimmedInput)) {
            setSkills([...skills, trimmedInput]);
            setSkillInput('');
        }
    };

    const handleSkillInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let avatarUrl = user?.avatarUrl;

        if (profileImageFile) {
            try {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
                const config = { 
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        fileName: profileImageFile.name,
                        fileType: profileImageFile.type,
                    }
                };
                
                const { data: signedUrlData } = await axios.get(
                    `${backendUrl}/api/pro/profile/signed-url`, config
                );
                
                await axios.put(signedUrlData.uploadUrl, profileImageFile, {
                    headers: { 'Content-Type': profileImageFile.type }
                });

                avatarUrl = signedUrlData.fileUrl;
            } catch (err) {
                console.error("Image upload failed", err);
                alert("Image upload failed. Please try again.");
                return;
            }
        }
        
        await dispatch(updateProfile({ 
            name, 
            email: user?.email,
            bio, 
            serviceablePincodes: pincodes, 
            avatarUrl,
            skills,
        }));
        setLocalImagePreview(null);
        setProfileImageFile(null);
    };

    const isLoading = status === 'loading';
    
    const finalImageUrl = localImagePreview || 
                          (user?.avatarUrl && user.avatarUrl.startsWith('http') ? user.avatarUrl : null) ||
                          (user?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e5e5e5&color=a3a3a3` : null);

    if (!isClient || !user) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-red-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-500 mt-1">This is how your profile appears to customers.</p>
            </div>
      
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                            <div className="relative w-32 h-32 mx-auto group">
                                {finalImageUrl && <img src={finalImageUrl} alt="Profile" className="w-full h-full rounded-full object-cover bg-gray-200" />}
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity">
                                    <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                            <h2 className="text-xl font-bold mt-4">{name || 'Partner Name'}</h2>
                            <p className="text-sm text-gray-500">{skills[0] || 'Specialist'}</p>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-6">Profile Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full p-2 border rounded-md"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Introduction / Bio</label>
                                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="mt-1 block w-full p-2 border rounded-md" placeholder="Tell customers a little about yourself..."/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-6">Vendor Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Company Name</label>
                            <p className="text-base text-gray-800 mt-1">{user?.partnerProfile?.companyName || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Aadhaar No.</label>
                            <p className="text-base text-gray-800 mt-1">{user?.partnerProfile?.aadhaarNo || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">GST No.</label>
                            <p className="text-base text-gray-800 mt-1">{user?.partnerProfile?.gstNo || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                 <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-6">Contact Persons</h3>
                    <div className="space-y-4">
                        {user?.partnerProfile?.contacts?.map((contact, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Name</label>
                                    <p className="text-base text-gray-800 mt-1">{contact.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Mobile</label>
                                    <p className="text-base text-gray-800 mt-1">{contact.mobile}</p>
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-500">Email</label>
                                    <p className="text-base text-gray-800 mt-1">{contact.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">My Skills</h3>
                        <div className="flex flex-col space-y-4">
                             <div className="flex items-center space-x-2">
                                <input 
                                    type="text" 
                                    value={skillInput} 
                                    onChange={(e) => setSkillInput(e.target.value)} 
                                    onKeyDown={handleSkillInputKeyDown}
                                    placeholder="e.g., Electrician" 
                                    className="block w-full p-2 border rounded-md"
                                />
                                <button type="button" onClick={handleAddSkill} className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600">Add</button>
                            </div>
                             <div className="flex flex-wrap gap-2">
                                {skills.length > 0 ? (
                                    skills.map((skill: string) => (
                                        <div key={skill} className="flex items-center bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                                            <span>{skill}</span>
                                            <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 text-gray-500 hover:text-gray-800">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No skills added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Serviceable Area</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Pincodes (comma-separated)</label>
                            <textarea value={pincodes} onChange={(e) => setPincodes(e.target.value)} rows={4} className="mt-1 block w-full p-2 border rounded-md" placeholder="e.g., 400058, 400059"/>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">My Documents</h3>
                        <ul className="space-y-3">
                           {Object.entries(user?.partnerProfile?.documents || {}).map(([key, value]) => {
                                if (key.endsWith('Url') && value) {
                                    const docName = key.replace('Url', '').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                    return (
                                        <li key={key} className="flex justify-between items-center">
                                            <span className="font-medium flex items-center"><FileText className="w-4 h-4 mr-2 text-gray-500"/>{docName}</span>
                                            <a href={value as string} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 font-semibold hover:underline">
                                                View
                                                <ExternalLink className="w-4 h-4 ml-2"/>
                                            </a>
                                        </li>
                                    );
                                }
                                return null;
                           })}
                        </ul>
                    </div>
                </div>

                <div className="text-right">
                    <button type="submit" disabled={isLoading} className="flex items-center justify-center ml-auto bg-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 disabled:bg-red-300">
                        {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                        Save All Changes
                    </button>
                </div>
            </form>
        </div>
    );
}