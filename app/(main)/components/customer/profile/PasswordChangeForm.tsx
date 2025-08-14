"use client";

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { updatePassword } from '@/app/store/features/auth/authSlice';
import { Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PasswordChangeForm() {
    const dispatch = useAppDispatch();
    const { status } = useAppSelector(state => state.auth);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmNewPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        if (formData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        const result = await dispatch(updatePassword({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
        }));

        if (updatePassword.fulfilled.match(result)) {
            toast.success('Password updated successfully!');
            setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } else {
            toast.error(result.payload as string || 'Failed to update password.');
        }
    };

    const isLoading = status === 'loading';

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold border-b pb-4 mb-6">Change Password</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input 
                        type="password" 
                        name="currentPassword" 
                        value={formData.currentPassword} 
                        onChange={handleChange} 
                        className="mt-1 block w-full p-2 border rounded-md" 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input 
                        type="password" 
                        name="newPassword" 
                        value={formData.newPassword} 
                        onChange={handleChange} 
                        className="mt-1 block w-full p-2 border rounded-md" 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input 
                        type="password" 
                        name="confirmNewPassword" 
                        value={formData.confirmNewPassword} 
                        onChange={handleChange} 
                        className="mt-1 block w-full p-2 border rounded-md" 
                        required 
                    />
                </div>
            </div>
            <div className="text-right mt-6">
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="flex items-center justify-center ml-auto bg-red-500 text-white px-6 py-2 rounded-lg font-semibold disabled:bg-red-300"
                >
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Update Password
                </button>
            </div>
        </form>
    );
}