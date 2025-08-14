"use client"

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface OtpVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (otp: string) => Promise<any>;
    loading: boolean;
    error: string | null;
}

export default function OtpVerificationModal({ isOpen, onClose, onVerify, loading, error }: OtpVerificationModalProps) {
    const [otp, setOtp] = useState('');
    
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 4) return;
        onVerify(otp);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Enter Booking OTP</h2>
                    <button onClick={onClose}><X className="w-6 h-6 text-gray-500" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 text-center">
                        <p className="text-sm text-gray-600 mb-4">Please ask the customer for the 4-digit OTP to start the job.</p>
                        <input
                            type="tel"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                            maxLength={4}
                            className="w-48 p-3 text-center text-2xl tracking-[1em] border-2 border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        />
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                    <div className="p-4 border-t">
                        <button
                            type="submit"
                            disabled={loading || otp.length !== 4}
                            className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:bg-gray-400"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Verify & Start Job"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}