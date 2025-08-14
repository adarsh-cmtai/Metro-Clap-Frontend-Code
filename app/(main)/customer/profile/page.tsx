"use client";

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { updateProfile, fetchCurrentUser } from '@/app/store/features/auth/authSlice';
import PasswordChangeForm from '@/app/(main)/components/customer/profile/PasswordChangeForm';
import { Camera, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyProfilePage() {
  const dispatch = useAppDispatch();
  const { user, status, token } = useAppSelector(state => state.auth);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (token && !user) {
        dispatch(fetchCurrentUser());
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      const displayName = user.name || 'New User';
      setImagePreview(user.avatarUrl || `https://ui-avatars.com/api/?name=${displayName.replace(' ', '+')}&background=random`);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1024 * 1024) {
          toast.error("File is too large. Maximum size is 1MB.");
          return;
      }
      setProfileImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let avatarUrl = user?.avatarUrl;

    if (profileImageFile) {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data: signedUrlData } = await axios.get(
                `${backendUrl}/api/customer/profile/signed-url?fileName=${profileImageFile.name}&fileType=${profileImageFile.type}`, config
            );
            await axios.put(signedUrlData.uploadUrl, profileImageFile, {
                headers: { 'Content-Type': profileImageFile.type }
            });
            console.log("this is data",signedUrlData);
            avatarUrl = signedUrlData.fileUrl;
        } catch (err) {
            toast.error("Image upload failed. Please try again.");
            console.error("Image upload failed", err);
            return;
        }
    }
    const result = await dispatch(updateProfile({ name, email, avatarUrl }));

    if (updateProfile.fulfilled.match(result)) {
        toast.success("Profile updated successfully!");
    } else {
        toast.error(result.payload as string || "Failed to update profile.");
    }
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-red-500" />
      </div>
    );
  }

  const isLoading = status === 'loading';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information and security settings.</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold border-b pb-4 mb-6">Personal Information</h3>
        <form onSubmit={handlePersonalInfoSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 text-center">
                <div className="relative w-32 h-32 mx-auto group">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Profile" className="w-full h-full rounded-full object-cover ring-2 ring-gray-200 p-1" />
                    ) : (
                        <div className="w-full h-full rounded-full bg-gray-200 animate-pulse"></div>
                    )}
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-8 h-8 text-white"/>
                    </button>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-4 text-sm font-semibold text-red-600 hover:underline">Change Photo</button>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF. 1MB max.</p>
            </div>
            <div className="md:col-span-2 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" value={user?.mobileNumber || ''} disabled className="mt-1 block w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"/>
                </div>
                <div className="text-right pt-2">
                    <button type="submit" disabled={isLoading} className="flex items-center justify-center ml-auto bg-red-500 text-white px-6 py-2 rounded-lg font-semibold disabled:bg-red-300">
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </form>
      </div>

      <PasswordChangeForm />
      
    </div>
  );
}