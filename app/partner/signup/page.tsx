"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { registerPartnerOtp, verifyOtpAndLogin, clearAuthError } from '@/app/store/features/auth/authSlice';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PartnerSignupPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { status, error, user } = useAppSelector(state => state.auth);

    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    useEffect(() => {
        dispatch(clearAuthError());
        if (user && user.role === 'partner') {
            router.push('/pro');
        }
    }, [user, router, dispatch]);

    const handleGetOtp = async (e: FormEvent) => {
        e.preventDefault();
        if (mobileNumber.length !== 10) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }
        const result = await dispatch(registerPartnerOtp({ mobileNumber }));
        if (registerPartnerOtp.fulfilled.match(result)) {
            setOtpSent(true);
        }
    };

    const handleVerifyOtp = async (e: FormEvent) => {
        e.preventDefault();
        if (otp.length !== 4) {
            alert("Please enter a valid 4-digit OTP.");
            return;
        }
        await dispatch(verifyOtpAndLogin({ mobileNumber, otp }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Partner Signup</h1>
                    <p className="mt-2 text-sm text-gray-600">Join our network of professionals</p>
                </div>
                
                {!otpSent ? (
                    <form onSubmit={handleGetOtp} className="space-y-6">
                        <div>
                            <label htmlFor="mobileNumber" className="text-sm font-medium text-gray-700">
                                Mobile Number
                            </label>
                            <div className="mt-1">
                                <input
                                    id="mobileNumber"
                                    name="mobileNumber"
                                    type="tel"
                                    autoComplete="tel"
                                    required
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    placeholder="Enter your 10-digit mobile number"
                                />
                            </div>
                        </div>

                        {error && <p className="text-sm text-center text-red-500">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400"
                            >
                                {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Get OTP'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                         <div>
                            <p className="text-sm text-center text-gray-600">
                                OTP sent to <span className="font-bold">{mobileNumber}</span>.
                                <button type="button" onClick={() => setOtpSent(false)} className="ml-2 text-xs font-semibold text-red-600 hover:underline">
                                    Change?
                                </button>
                            </p>
                        </div>
                        <div>
                            <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                                Enter OTP
                            </label>
                            <div className="mt-1">
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    placeholder="4-digit code"
                                />
                            </div>
                        </div>

                        {error && <p className="text-sm text-center text-red-500">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400"
                            >
                                {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Verify & Create Account'}
                            </button>
                        </div>
                    </form>
                )}

                <p className="text-sm text-center text-gray-600">
                    Want to apply with documents?{' '}
                    <Link href="/partner" className="font-medium text-red-600 hover:text-red-500">
                        Go to full application
                    </Link>
                </p>
            </div>
        </div>
    );
}